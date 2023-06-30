import { JSONRPCTransform } from "../src/jsonRpcTransform";
import { Readable } from "stream";
import { JSONRPCRequest, JSONRPCResponse } from "json-rpc-2.0";
import { once } from 'events';
import {describe, expect, it} from "vitest";

const mockReadStreamOK = (jsonRPC: JSONRPCResponse | JSONRPCRequest | JSONRPCResponse[] | JSONRPCRequest[] | (JSONRPCRequest | JSONRPCResponse)[] | string | string[]) => {
    const readable = new Readable();
    const jsonRPCs = Array.isArray(jsonRPC) ? jsonRPC : [jsonRPC];
    jsonRPCs.forEach(j => {
        if ((typeof(j) !== 'string')) {
            const jsonRPCStr = JSON.stringify(j);
            readable.push(`Content-Length: ${jsonRPCStr.length}\r\n\r\n${jsonRPCStr}`);
        } else {
            readable.push(j);
        }
    })
    readable.push(null);

    return readable;
};

const mockReadStreamKO = (jsonRPC: JSONRPCResponse | JSONRPCRequest) => {
    const readable = new Readable();
    const jsonRPCStr = JSON.stringify(jsonRPC);
    readable.push(`Content-Length: invalid\r\n\r\n${jsonRPCStr}`);
    readable.push(null);

    return readable;
};

describe('JSONRPCTransform', () => {

    it('unpacks a raw JSON RPC response into an JSONRPCResponse instance', async () => {
        const response: JSONRPCResponse = { "jsonrpc": "2.0", "id": 0, "result": {
            "capabilities": { "textDocumentSync": 1, "hoverProvider": true, "completionProvider": { "resolveProvider": false, "triggerCharacters": ["."] }, "definitionProvider": true, "referencesProvider": true, "documentSymbolProvider": true, "codeActionProvider": { "codeActionKinds": ["quickfix", "refactor.extract"] }, "codeLensProvider": { "resolveProvider": false }, "renameProvider": true }
        }};

        const jsonRpcTransform = JSONRPCTransform.createStream(mockReadStreamOK(response));
        const jsonrpc = (await once(jsonRpcTransform, 'data'))[0];
        expect(jsonrpc).toEqual(JSON.stringify(response));
    });

    it('unpacks a raw JSON RPC request into an JSONRPCRequest instance', async () => {
        const request: JSONRPCRequest = { "jsonrpc": "2.0", "method": "telemetry/event", "params": { "properties": { "Feature": "ApexPrelude-startup", "Exception": "None" }, "measures": { "ExecutionTime": 2673 } } };

        const jsonRpcTransform = JSONRPCTransform.createStream(mockReadStreamOK(request));
        const jsonrpc = (await once(jsonRpcTransform, 'data'))[0];
        expect(jsonrpc).toEqual(JSON.stringify(request));
    });

    it('throws an error with a bad header', async() => {
        const request: JSONRPCRequest = { "jsonrpc": "2.0", "method": "telemetry/event", "params": { "properties": { "Feature": "ApexPrelude-startup", "Exception": "None" }, "measures": { "ExecutionTime": 2673 } } };

        const jsonRpcTransform = JSONRPCTransform.createStream(mockReadStreamKO(request));

        const errorMessage = (await once(jsonRpcTransform, 'error'))[0];
        expect(errorMessage.message).toContain('Bad header');
    })

    it('calls callback more than once with multiple JSONRPCs', async () => {
        const response: JSONRPCResponse = {
            "jsonrpc": "2.0", "id": 1, "result": {
                "capabilities": { "textDocumentSync": 1, "hoverProvider": true, "completionProvider": { "resolveProvider": false, "triggerCharacters": ["."] }, "definitionProvider": true, "referencesProvider": true, "documentSymbolProvider": true, "codeActionProvider": { "codeActionKinds": ["quickfix", "refactor.extract"] }, "codeLensProvider": { "resolveProvider": false }, "renameProvider": true }
            }
        };
        const request: JSONRPCRequest = { "jsonrpc": "2.0", "method": "telemetry/event", "params": { "properties": { "Feature": "ApexPrelude-startup", "Exception": "None" }, "measures": { "ExecutionTime": 3000 } } };
        const payload = [response, request];
        const jsonRpcTransform = JSONRPCTransform.createStream(mockReadStreamOK(payload));

        let payloadIdx = 0;
        for await (const j of jsonRpcTransform) {
            expect(j).toEqual(JSON.stringify(payload[payloadIdx++]));
        }
    });

    it('process multiple JSONs in one _transform', async () => {
        const response: JSONRPCResponse = {
            "jsonrpc": "2.0", "id": 1, "result": {
                "capabilities": { "textDocumentSync": 1, "hoverProvider": true, "completionProvider": { "resolveProvider": false, "triggerCharacters": ["."] }, "definitionProvider": true, "referencesProvider": true, "documentSymbolProvider": true, "codeActionProvider": { "codeActionKinds": ["quickfix", "refactor.extract"] }, "codeLensProvider": { "resolveProvider": false }, "renameProvider": true }
            }
        };
        const request: JSONRPCRequest = { "jsonrpc": "2.0", "method": "telemetry/event", "params": { "properties": { "Feature": "ApexPrelude-startup", "Exception": "None" }, "measures": { "ExecutionTime": 3000 } } };

        const jsonRpcResponseStr = JSON.stringify(response);
        const jsonRpcRequestStr = JSON.stringify(request);

        const payload = [request, response];
        const payloadSingle = `Content-Length: ${jsonRpcRequestStr.length}\r\n\r\n${jsonRpcRequestStr}Content-Length: ${jsonRpcResponseStr.length}\r\n\r\n${jsonRpcResponseStr}`;

        const jsonRpcTransform = JSONRPCTransform.createStream(mockReadStreamOK(payloadSingle));

        let payloadIdx = 0;
        for await (const j of jsonRpcTransform) {
            expect(j).toEqual(JSON.stringify(payload[payloadIdx++]));
        }
    });

    it('buffers partial JSONs', async () => {
        const response: JSONRPCResponse = {
            "jsonrpc": "2.0", "id": 1, "result": {
                "capabilities": { "textDocumentSync": 1, "hoverProvider": true, "completionProvider": { "resolveProvider": false, "triggerCharacters": ["."] }, "definitionProvider": true, "referencesProvider": true, "documentSymbolProvider": true, "codeActionProvider": { "codeActionKinds": ["quickfix", "refactor.extract"] }, "codeLensProvider": { "resolveProvider": false }, "renameProvider": true }
            }
        };
        const request: JSONRPCRequest = { "jsonrpc": "2.0", "method": "telemetry/event", "params": { "properties": { "Feature": "ApexPrelude-startup", "Exception": "None" }, "measures": { "ExecutionTime": 3000 } } };

        const jsonRpcResponseStr = JSON.stringify(response);
        const jsonRpcRequestStr = JSON.stringify(request);

        const payload = [response, request];
        const payloadSplit = [`Content-Length: ${jsonRpcResponseStr.length}\r\n\r\n${jsonRpcResponseStr}Content-Length: ${jsonRpcRequestStr.length}\r\n\r\n${jsonRpcRequestStr.substring(0, 50)}`, jsonRpcRequestStr.substring(50)];

        const jsonRpcTransform = JSONRPCTransform.createStream(mockReadStreamOK(payloadSplit));

        let payloadIdx = 0;
        for await (const j of jsonRpcTransform) {
            expect(j).toEqual(JSON.stringify(payload[payloadIdx++]));
        }
    });

    it('buffers partial JSONs within the same RPC', async () => {
        const response: JSONRPCResponse = {
            "jsonrpc": "2.0", "id": 1, "result": {
                "capabilities": { "textDocumentSync": 1, "hoverProvider": true, "completionProvider": { "resolveProvider": false, "triggerCharacters": ["."] }, "definitionProvider": true, "referencesProvider": true, "documentSymbolProvider": true, "codeActionProvider": { "codeActionKinds": ["quickfix", "refactor.extract"] }, "codeLensProvider": { "resolveProvider": false }, "renameProvider": true }
            }
        };
        const request: JSONRPCRequest = { "jsonrpc": "2.0", "method": "telemetry/event", "params": { "properties": { "Feature": "ApexPrelude-startup", "Exception": "None" }, "measures": { "ExecutionTime": 3000 } } };

        const jsonRpcResponseStr = JSON.stringify(response);
        const jsonRpcRequestStr = JSON.stringify(request);

        const payload = [response, request];
        const payloadSplit = [`Content-Length: ${jsonRpcResponseStr.length}\r\n\r\n${jsonRpcResponseStr}`, `Content-Length: ${jsonRpcRequestStr.length}\r\n\r\n${jsonRpcRequestStr.substring(0, 50)}`, jsonRpcRequestStr.substring(50)];

        const jsonRpcTransform = JSONRPCTransform.createStream(mockReadStreamOK(payloadSplit));

        let payloadIdx = 0;
        for await (const j of jsonRpcTransform) {
            expect(j).toEqual(JSON.stringify(payload[payloadIdx++]));
        }
    });
});
