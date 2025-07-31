import { JSONRPCRequest, JSONRPCResponse } from "json-rpc-2.0";
import { Readable } from "stream";
import { JSONRPCEndpoint } from "../src/jsonRpcEndpoint";
import { LspClient } from "../src/lspClient";
import { ClientCapabilities, DidCloseTextDocumentParams, DidOpenTextDocumentParams, DocumentSymbol, SymbolKind, Location, SignatureHelp } from "../src/models";
import {describe, expect, it} from "vitest";
import { WriteMemory } from "./testUtils";

describe('LspClient', () => {

    it('sends a LSP Initialize request', async () => {
        const mockWriteStream: WriteMemory = new WriteMemory();
        const mockReadStream: Readable = new Readable();
        const initResponse: JSONRPCResponse = {
            "jsonrpc": "2.0", "id": 0, "result": {
                "capabilities": { "textDocumentSync": 1, "hoverProvider": true, "completionProvider": { "resolveProvider": false, "triggerCharacters": ["."] }, "definitionProvider": true, "referencesProvider": true, "documentSymbolProvider": true, "codeActionProvider": { "codeActionKinds": ["quickfix", "refactor.extract"] }, "codeLensProvider": { "resolveProvider": false }, "renameProvider": true }
            }
        };
        const e: JSONRPCEndpoint = new JSONRPCEndpoint(mockWriteStream, mockReadStream);
        const client = new LspClient(e);

        const capabilities: ClientCapabilities = {
            'textDocument': {
                'codeAction': { 'dynamicRegistration': true },
                'codeLens': { 'dynamicRegistration': true },
                'colorProvider': { 'dynamicRegistration': true },
                'completion': {
                    'completionItem': {
                        'commitCharactersSupport': true,
                        'documentationFormat': ['markdown', 'plaintext'],
                        'snippetSupport': true
                    },
                    'completionItemKind': {
                        'valueSet': [1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                            9,
                            10,
                            11,
                            12,
                            13,
                            14,
                            15,
                            16,
                            17,
                            18,
                            19,
                            20,
                            21,
                            22,
                            23,
                            24,
                            25]
                    },
                    'contextSupport': true,
                    'dynamicRegistration': true
                },
                'definition': { 'dynamicRegistration': true },
                'documentHighlight': { 'dynamicRegistration': true },
                'documentLink': { 'dynamicRegistration': true },
                'documentSymbol': {
                    'dynamicRegistration': true,
                    'symbolKind': {
                        'valueSet': [1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                            9,
                            10,
                            11,
                            12,
                            13,
                            14,
                            15,
                            16,
                            17,
                            18,
                            19,
                            20,
                            21,
                            22,
                            23,
                            24,
                            25,
                            26]
                    }
                },
                'formatting': { 'dynamicRegistration': true },
                'hover': {
                    'contentFormat': ['markdown', 'plaintext'],
                    'dynamicRegistration': true
                },
                'implementation': { 'dynamicRegistration': true },
                'onTypeFormatting': { 'dynamicRegistration': true },
                'publishDiagnostics': { 'relatedInformation': true },
                'rangeFormatting': { 'dynamicRegistration': true },
                'references': { 'dynamicRegistration': true },
                'rename': { 'dynamicRegistration': true },
                'signatureHelp': {
                    'dynamicRegistration': true,
                    'signatureInformation': { 'documentationFormat': ['markdown', 'plaintext'] }
                },
                'synchronization': {
                    'didSave': true,
                    'dynamicRegistration': true,
                    'willSave': true,
                    'willSaveWaitUntil': true
                },
                'typeDefinition': { 'dynamicRegistration': true }
            },
            'workspace': {
                'applyEdit': true,
                'configuration': true,
                'didChangeConfiguration': { 'dynamicRegistration': true },
                'didChangeWatchedFiles': { 'dynamicRegistration': true },
                'executeCommand': { 'dynamicRegistration': true },
                'symbol': {
                    'dynamicRegistration': true,
                    'symbolKind': {
                        'valueSet': [1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                            9,
                            10,
                            11,
                            12,
                            13,
                            14,
                            15,
                            16,
                            17,
                            18,
                            19,
                            20,
                            21,
                            22,
                            23,
                            24,
                            25,
                            26]
                    }
                }, 'workspaceEdit': { 'documentChanges': true },
                'workspaceFolders': true
            }
        }

        const root_uri = 'file:////random/folder'
        const workspaceFolders = [{ 'name': 'my-workspace', 'uri': root_uri }]

        const initResRPCMessage: JSONRPCResponse = { "jsonrpc": "2.0", "result": initResponse, "id": 0 };

        mockReadStream.push(`Content-Length: ${JSON.stringify(initResRPCMessage).length}\r\n\r\n${JSON.stringify(initResRPCMessage)}`);
        mockReadStream.push(null);

        const response = await client.initialize({
            processId: -1,
            rootPath: '.',
            rootUri: null,
            capabilities: capabilities,
            trace: 'off',
            workspaceFolders: workspaceFolders
        });

        expect(JSON.stringify(initResponse)).toEqual(JSON.stringify(response));
    });

    it('sends a LSP Initialized notification', async () => {
        const mockWriteStream: WriteMemory = new WriteMemory();
        const mockReadStream: Readable = new Readable();

        const e: JSONRPCEndpoint = new JSONRPCEndpoint(mockWriteStream, mockReadStream);
        const client = new LspClient(e);

        client.initialized();

        mockReadStream.push(null);

        const initializedNotification: JSONRPCRequest = { "jsonrpc": "2.0", "method": "initialized" };
        expect(mockWriteStream.buffer()).toBe(`Content-Length: ${JSON.stringify(initializedNotification).length}\r\n\r\n${JSON.stringify(initializedNotification)}`);
    });

    it('sends a LSP Shutdown request', async () => {
        const mockWriteStream: WriteMemory = new WriteMemory();
        const mockReadStream: Readable = new Readable();
        const shutdownRespose: JSONRPCResponse = {
            "jsonrpc": "2.0", "id": 0, "result": { }
        };
        const e: JSONRPCEndpoint = new JSONRPCEndpoint(mockWriteStream, mockReadStream);

        const client = new LspClient(e);

        mockReadStream.push(`Content-Length: ${JSON.stringify(shutdownRespose).length}\r\n\r\n${JSON.stringify(shutdownRespose)}`);
        mockReadStream.push(null);

        const response = await client.shutdown();

        expect(response).toEqual({});
    });

    it('sends a LSP Exit notification', async () => {
        const mockWriteStream: WriteMemory = new WriteMemory();
        const mockReadStream: Readable = new Readable();

        const e: JSONRPCEndpoint = new JSONRPCEndpoint(mockWriteStream, mockReadStream);
        const client = new LspClient(e);

        client.exit();

        mockReadStream.push(null);

        const exitNotification: JSONRPCRequest = { "jsonrpc": "2.0", "method": "exit" };
        expect(mockWriteStream.buffer()).toBe(`Content-Length: ${JSON.stringify(exitNotification).length}\r\n\r\n${JSON.stringify(exitNotification)}`);
    });

    it('sends a LSP textDocument/didOpen notification', async () => {
        const mockWriteStream: WriteMemory = new WriteMemory();
        const mockReadStream: Readable = new Readable();

        const e: JSONRPCEndpoint = new JSONRPCEndpoint(mockWriteStream, mockReadStream);
        const client = new LspClient(e);

        const didOpenParams: DidOpenTextDocumentParams = { textDocument: {
            uri: 'file:///fake-file.js',
            languageId: 'js',
            text: 'console.log("Hello, World!");',
            version: 1
            }
        };

        client.didOpen(didOpenParams);

        mockReadStream.push(null);

        const didOpenNotification: JSONRPCRequest = { "jsonrpc": "2.0", "method": "textDocument/didOpen", params: didOpenParams };
        expect(mockWriteStream.buffer()).toBe(`Content-Length: ${JSON.stringify(didOpenNotification).length}\r\n\r\n${JSON.stringify(didOpenNotification)}`);
    });

    it('sends a LSP textDocument/didClose notification', async () => {
        const mockWriteStream: WriteMemory = new WriteMemory();
        const mockReadStream: Readable = new Readable();

        const e: JSONRPCEndpoint = new JSONRPCEndpoint(mockWriteStream, mockReadStream);
        const client = new LspClient(e);

        const didCloseParams: DidCloseTextDocumentParams = {
            textDocument: {
                uri: 'file:///fake-file.js',
            }
        };

        client.didClose(didCloseParams);

        mockReadStream.push(null);

        const didOpenNotification: JSONRPCRequest = { "jsonrpc": "2.0", "method": "textDocument/didClose", params: didCloseParams };
        expect(mockWriteStream.buffer()).toBe(`Content-Length: ${JSON.stringify(didOpenNotification).length}\r\n\r\n${JSON.stringify(didOpenNotification)}`);
    });

    it('sends a LSP textDocument/documentSymbol request', async () => {
        const mockWriteStream: WriteMemory = new WriteMemory();
        const mockReadStream: Readable = new Readable();
        const resDocumentSymbol: DocumentSymbol[] = [{
            kind: SymbolKind.Array,
            name: 'anArray',
            range: {
                start: {
                    line: 1,
                    character: 1
                },
                end: {
                    line: 1,
                    character: 10
                }
            },
            selectionRange: {
                start: {
                    line: 1,
                    character: 1
                },
                end: {
                    line: 1,
                    character: 10
                }
            }
        }];
        const documentSymbolRespose: JSONRPCResponse = {
            "jsonrpc": "2.0", "id": 0, "result": resDocumentSymbol
        };
        const e: JSONRPCEndpoint = new JSONRPCEndpoint(mockWriteStream, mockReadStream);

        const client = new LspClient(e);

        mockReadStream.push(`Content-Length: ${JSON.stringify(documentSymbolRespose).length}\r\n\r\n${JSON.stringify(documentSymbolRespose)}`);
        mockReadStream.push(null);

        const response = await client.documentSymbol({
            textDocument: {
                uri: 'file:///fake-file.js'
            }
        });

        expect(response).toEqual(resDocumentSymbol);
    });

    it('sends a LSP textDocument/references request', async () => {
        const mockWriteStream: WriteMemory = new WriteMemory();
        const mockReadStream: Readable = new Readable();
        const resReferences: Location[] = [{
            range: {
                start: {
                    line: 1,
                    character: 1
                },
                end: {
                    line: 1,
                    character: 10
                }
            },
            uri: 'file:///other-fake-file.js'
        }];
        const referencesRespose: JSONRPCResponse = {
            "jsonrpc": "2.0", "id": 0, "result": resReferences
        };
        const e: JSONRPCEndpoint = new JSONRPCEndpoint(mockWriteStream, mockReadStream);

        const client = new LspClient(e);

        mockReadStream.push(`Content-Length: ${JSON.stringify(referencesRespose).length}\r\n\r\n${JSON.stringify(referencesRespose)}`);
        mockReadStream.push(null);

        const response = await client.references({
            textDocument: {
                uri: 'file:///fake-file.js'
            },
            context: {
                includeDeclaration: false
            },
            position: {
                character: 1,
                line: 1
            }
        });

        expect(response).toEqual(resReferences);
    });

    it('sends a LSP textDocument/definition request', async () => {
        const mockWriteStream: WriteMemory = new WriteMemory();
        const mockReadStream: Readable = new Readable();
        const resDefinition: Location[] = [{
            range: {
                start: {
                    line: 1,
                    character: 1
                },
                end: {
                    line: 1,
                    character: 10
                }
            },
            uri: 'file:///other-fake-file.js'
        }];
        const definitionRespose: JSONRPCResponse = {
            "jsonrpc": "2.0", "id": 0, "result": resDefinition
        };
        const e: JSONRPCEndpoint = new JSONRPCEndpoint(mockWriteStream, mockReadStream);

        const client = new LspClient(e);

        mockReadStream.push(`Content-Length: ${JSON.stringify(definitionRespose).length}\r\n\r\n${JSON.stringify(definitionRespose)}`);
        mockReadStream.push(null);

        const response = await client.definition({
            textDocument: {
                uri: 'file:///fake-file.js'
            },
            position: {
                character: 1,
                line: 1
            }
        });

        expect(response).toEqual(resDefinition);
    });

    it('sends a LSP textDocument/typeDefinition request', async () => {
        const mockWriteStream: WriteMemory = new WriteMemory();
        const mockReadStream: Readable = new Readable();
        const resTypeDefinition: Location[] = [{
            range: {
                start: {
                    line: 1,
                    character: 1
                },
                end: {
                    line: 1,
                    character: 10
                }
            },
            uri: 'file:///other-fake-file.js'
        }];
        const typeDefinitionRespose: JSONRPCResponse = {
            "jsonrpc": "2.0", "id": 0, "result": resTypeDefinition
        };
        const e: JSONRPCEndpoint = new JSONRPCEndpoint(mockWriteStream, mockReadStream);

        const client = new LspClient(e);

        mockReadStream.push(`Content-Length: ${JSON.stringify(typeDefinitionRespose).length}\r\n\r\n${JSON.stringify(typeDefinitionRespose)}`);
        mockReadStream.push(null);

        const response = await client.typeDefinition({
            textDocument: {
                uri: 'file:///fake-file.js'
            },
            position: {
                character: 1,
                line: 1
            }
        });

        expect(response).toEqual(resTypeDefinition);
    });

    it('sends a LSP textDocument/signatureHelp request', async () => {
        const mockWriteStream: WriteMemory = new WriteMemory();
        const mockReadStream: Readable = new Readable();
        const resSignatureHelp: SignatureHelp = {
            signatures: [{
                label: 'aLabel'
            }]
        };
        const signatureHelpRespose: JSONRPCResponse = {
            "jsonrpc": "2.0", "id": 0, "result": resSignatureHelp
        };
        const e: JSONRPCEndpoint = new JSONRPCEndpoint(mockWriteStream, mockReadStream);

        const client = new LspClient(e);

        mockReadStream.push(`Content-Length: ${JSON.stringify(signatureHelpRespose).length}\r\n\r\n${JSON.stringify(signatureHelpRespose)}`);
        mockReadStream.push(null);

        const response = await client.signatureHelp({
            textDocument: {
                uri: 'file:///fake-file.js'
            },
            position: {
                character: 1,
                line: 1
            }
        });

        expect(response).toEqual(resSignatureHelp);
    });

    it('waits for a notification from LSP server', async () => {
        const mockWriteStream: WriteMemory = new WriteMemory();
        const mockReadStream: Readable = new Readable();
        const telemetryEventRequest: JSONRPCRequest = { "jsonrpc": "2.0", "method": "telemetry/event", "params": { "properties": { "Feature": "ApexPrelude-startup", "Exception": "None" }, "measures": { "ExecutionTime": 2673 } } };

        const e: JSONRPCEndpoint = new JSONRPCEndpoint(mockWriteStream, mockReadStream);

        const client = new LspClient(e);

        mockReadStream.push(`Content-Length: ${JSON.stringify(telemetryEventRequest).length}\r\n\r\n${JSON.stringify(telemetryEventRequest)}`);
        mockReadStream.push(null);

        const telEventRes = (await client.once('telemetry/event'))[0];

        expect(telEventRes).toEqual(telemetryEventRequest.params);
    });
    
    it('handles server request while waiting for a response', async () => {
        const mockWriteStream: WriteMemory = new WriteMemory();
        const mockReadStream = new Readable({
            read() {
                return
            }
        });
        const e: JSONRPCEndpoint = new JSONRPCEndpoint(mockWriteStream, mockReadStream);
        const client = new LspClient(e);
        
        // Create a promise that will be resolved when the server request is received
        let serverRequestParams: { items: { section: string }[] };
        let serverRequestId: number;
        const serverRequestReceived = new Promise<void>(resolve => {
            e.on('workspace/configuration', (params, id) => {
                serverRequestParams = params;
                serverRequestId = id;
                resolve();
            });
        });
        
        // Set up the client to send a request
        const clientRequestPromise = client.shutdown();
        
        // Before sending the response to the client request, simulate the server sending a request with an ID
        // This is the key part of the test - a server request with an ID that could be mistaken for a response
        const serverRequest = { 
            "jsonrpc": "2.0", 
            "id": 100, // Server's request ID
            "method": "workspace/configuration", 
            "params": { 
                "items": [{ "section": "typescript" }] 
            } 
        };
        
        // Push the server request to the stream
        mockReadStream.push(`Content-Length: ${JSON.stringify(serverRequest).length}\r\n\r\n${JSON.stringify(serverRequest)}`);

        // Wait for the server request to be processed
        await serverRequestReceived;
        
        // Verify the server request was correctly identified as a request (not a response)
        expect(serverRequestParams).toEqual(serverRequest.params);
        expect(serverRequestId).toEqual(serverRequest.id);

        // Respond to the server request
        const configResult = [{ settings: { typescript: { format: { enable: true } } } }];
        client.respondToServerRequest(serverRequestId, configResult);
        
        // Verify the response was sent correctly
        const expectedServerResponse = {
            jsonrpc: "2.0",
            id: 100,
            result: configResult
        };
        expect(mockWriteStream.buffer()).toContain(JSON.stringify(expectedServerResponse));
        
        // Reset the write buffer to isolate the next response
        mockWriteStream.reset();

        // Now send the response to the client's original request
        const shutdownResponse: JSONRPCResponse = {
            "jsonrpc": "2.0", "id": 0, "result": {}
        };
        mockReadStream.push(`Content-Length: ${JSON.stringify(shutdownResponse).length}\r\n\r\n${JSON.stringify(shutdownResponse)}`);
        mockReadStream.push(null);
        
        // The client request should still resolve correctly
        const response = await clientRequestPromise;
        expect(response).toEqual({});
    });
    
    it('responds to server requests using onRequest', async () => {
        const mockWriteStream: WriteMemory = new WriteMemory();
        const mockReadStream = new Readable({
            read() {
                return
            }
        });
        const e: JSONRPCEndpoint = new JSONRPCEndpoint(mockWriteStream, mockReadStream);
        const client = new LspClient(e);
        
        // Set up a listener for workspace/configuration requests
        const requestHandled = new Promise<void>(resolve => {
            client.onRequest('workspace/configuration', (params, requestId) => {
                if (requestId !== undefined) {
                    // Respond with configuration settings
                    const configResult = [{ settings: { typescript: { format: { enable: true } } } }];
                    client.respondToServerRequest(requestId, configResult);
                    resolve();
                }
            });
        });
        
        // Simulate the server sending a request
        const serverRequest = { 
            "jsonrpc": "2.0", 
            "id": 200, 
            "method": "workspace/configuration", 
            "params": { 
                "items": [{ "section": "typescript" }] 
            } 
        };
        
        // Push the server request to the stream
        mockReadStream.push(`Content-Length: ${JSON.stringify(serverRequest).length}\r\n\r\n${JSON.stringify(serverRequest)}`);

        // Wait for the request to be handled
        await requestHandled;
        
        // Verify the response was sent correctly
        const expectedServerResponse = {
            jsonrpc: "2.0",
            id: 200,
            result: [{ settings: { typescript: { format: { enable: true } } } }]
        };
        expect(mockWriteStream.buffer()).toContain(JSON.stringify(expectedServerResponse));
    });
});
