import { once } from "events";
import { JSONRPCRequest, JSONRPCResponse } from "json-rpc-2.0";
import { Readable, Writable } from "stream";
import { JSONRPCEndpoint } from "../src/jsonRpcEndpoint";
import {describe, expect, it} from "vitest";

class WriteMemory extends Writable {
    private _buffer: string;

    public constructor() {
        super();
        this._buffer = '';
    }

    public _write(chunk, _, next) {
        this._buffer += chunk;
        next();
    }

    public reset() {
        this._buffer = '';
    }

    public buffer() {
        return this._buffer;
    }
}

const mockReadStreamOK = (jsonRPC: JSONRPCResponse | JSONRPCRequest | JSONRPCResponse[] | JSONRPCRequest[] | (JSONRPCRequest | JSONRPCResponse)[] | string | string[], eof?: boolean) => {
    const readable = new Readable();
    const jsonRPCs = Array.isArray(jsonRPC) ? jsonRPC : [jsonRPC];
    jsonRPCs.forEach(j => {
        if ((typeof (j) !== 'string')) {
            const jsonRPCStr = JSON.stringify(j);
            readable.push(`Content-Length: ${jsonRPCStr.length}\r\n\r\n${jsonRPCStr}`);
        } else {
            //console.log(`j is string: ${j}`)
            readable.push(j);
        }
    })
    if (eof) {
        readable.push(null);
    }

    return readable;
};

describe('JSONRPCEndpoint', () => {
    it('sends a JSONRPC request', async () => {
        const mockWriteStream: WriteMemory = new WriteMemory();
        const e: JSONRPCEndpoint = new JSONRPCEndpoint(mockWriteStream, mockReadStreamOK([], true));

        const message = { param1: 'value1', param2: { subParam1: 'subValue1' } };

        e.send('someMethod', message);

        const jsonRpcMessage: JSONRPCRequest = { "jsonrpc": "2.0", "id": 0, "method": "someMethod", "params": message};

        expect(mockWriteStream.buffer()).toBe(`Content-Length: ${JSON.stringify(jsonRpcMessage).length}\r\n\r\n${JSON.stringify(jsonRpcMessage)}`);
    });

    it('sends a JSONRPC notification', async () => {
        const mockWriteStream: WriteMemory = new WriteMemory();
        const e: JSONRPCEndpoint = new JSONRPCEndpoint(mockWriteStream, mockReadStreamOK([], true));

        const message = { param1: 'value1', param2: { subParam1: 'subValue1' } };

        e.notify('someMethod', message);

        const jsonRpcMessage: JSONRPCRequest = { "jsonrpc": "2.0", "method": "someMethod", "params": message };

        expect(mockWriteStream.buffer()).toBe(`Content-Length: ${JSON.stringify(jsonRpcMessage).length}\r\n\r\n${JSON.stringify(jsonRpcMessage)}`);
    });

    it('sends a JSONRPC notification with emojis payload', async () => {
        const mockWriteStream: WriteMemory = new WriteMemory();
        const e: JSONRPCEndpoint = new JSONRPCEndpoint(mockWriteStream, mockReadStreamOK([], true));

        const message = { param1: 'value1😀', param2: { subParam1: 'subValue1🎉' } };

        e.notify('someMethod', message);

        const jsonRpcMessage: JSONRPCRequest = { "jsonrpc": "2.0", "method": "someMethod", "params": message };

        // Calculate byte size instead of character size to account for emojis
        const byteSize = Buffer.byteLength(JSON.stringify(jsonRpcMessage), 'utf8');

        expect(mockWriteStream.buffer()).toBe(`Content-Length: ${byteSize}\r\n\r\n${JSON.stringify(jsonRpcMessage)}`);
    });

    it('sends a JSONRPC request with the matched response', async () => {
        const mockWriteStream: WriteMemory = new WriteMemory();
        const mockReadStream: Readable = mockReadStreamOK([], false);

        const e: JSONRPCEndpoint = new JSONRPCEndpoint(mockWriteStream, mockReadStream);

        const reqMessage = { param1: 'value1', param2: { subParam1: 'subValue1' } };
        const resMessage = { "responseParam1": 'resValue1' };
        const resRPCMessage: JSONRPCResponse = { "jsonrpc": "2.0", "result": resMessage, "id": 0 };

        mockReadStream.push(`Content-Length: ${JSON.stringify(resRPCMessage).length}\r\n\r\n${JSON.stringify(resRPCMessage)}`);
        mockReadStream.push(null);

        const response = await e.send('someMethod', reqMessage);

        expect(JSON.stringify(response)).toEqual(JSON.stringify(resMessage));
    });

    it('waits for a JSONRPC request from server', async () => {
        const mockWriteStream: WriteMemory = new WriteMemory();
        const mockReadStream: Readable = mockReadStreamOK([], false);

        const e: JSONRPCEndpoint = new JSONRPCEndpoint(mockWriteStream, mockReadStream);

        const reqMessage = { param1: 'value1', param2: { subParam1: 'subValue1' } };
        const reqRPCMessage: JSONRPCRequest = { "jsonrpc": "2.0", "method": "someNotifyMethod", "params": reqMessage };

        mockReadStream.push(`Content-Length: ${JSON.stringify(reqRPCMessage).length}\r\n\r\n${JSON.stringify(reqRPCMessage)}`);
        mockReadStream.push(null);

        const response = (await once(e, 'someNotifyMethod'))[0];

        expect(JSON.stringify(response)).toEqual(JSON.stringify(reqMessage));
    });

    it('emits an error with a mismatching JSONRPC response', async () => {
        const mockWriteStream: WriteMemory = new WriteMemory();
        const mockReadStream: Readable = mockReadStreamOK([], false);

        const e: JSONRPCEndpoint = new JSONRPCEndpoint(mockWriteStream, mockReadStream);

        const reqMessage = { param1: 'value1', param2: { subParam1: 'subValue1' } };
        const resMessage = { "responseParam1": 'resValue1' };
        const resRPCMessage: JSONRPCResponse = { "jsonrpc": "2.0", "result": resMessage, "id": 10 };

        mockReadStream.push(`Content-Length: ${JSON.stringify(resRPCMessage).length}\r\n\r\n${JSON.stringify(resRPCMessage)}`);
        mockReadStream.push(null);

        e.send('someMethod', reqMessage);

        const response = (await once(e, 'error'))[0];

        expect(response).toContain('Got 10, expected 0');
    });
});
