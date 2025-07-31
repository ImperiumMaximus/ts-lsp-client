import { Readable } from "stream";
import { JSONRPCEndpoint } from "../src/jsonRpcEndpoint";
import { LspClient } from "../src/lspClient";
import { describe, expect, it } from "vitest";
import { WriteMemory } from "./testUtils";

describe('Server Requests', () => {
    it('responds to server requests', async () => {
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

    it('handles multiple server requests', async () => {
        const mockWriteStream: WriteMemory = new WriteMemory();
        const mockReadStream = new Readable({
            read() {
                return
            }
        });
        const e: JSONRPCEndpoint = new JSONRPCEndpoint(mockWriteStream, mockReadStream);
        const client = new LspClient(e);
        
        // Track request IDs and responses
        const requestIds: number[] = [];
        const requestHandled = new Promise<void>(resolve => {
            client.onRequest('workspace/configuration', (params, requestId) => {
                if (requestId !== undefined) {
                    requestIds.push(requestId);
                    // Respond with configuration settings
                    const configResult = [{ settings: { typescript: { format: { enable: true } } } }];
                    client.respondToServerRequest(requestId, configResult);
                    
                    if (requestIds.length === 2) {
                        resolve();
                    }
                }
            });
        });
        
        // Simulate the server sending two requests
        const serverRequest1 = { 
            "jsonrpc": "2.0", 
            "id": 200, 
            "method": "workspace/configuration", 
            "params": { 
                "items": [{ "section": "typescript" }] 
            } 
        };
        
        const serverRequest2 = { 
            "jsonrpc": "2.0", 
            "id": 201, 
            "method": "workspace/configuration", 
            "params": { 
                "items": [{ "section": "javascript" }] 
            } 
        };
        
        // Push the server requests to the stream
        mockReadStream.push(`Content-Length: ${JSON.stringify(serverRequest1).length}\r\n\r\n${JSON.stringify(serverRequest1)}`);
        mockReadStream.push(`Content-Length: ${JSON.stringify(serverRequest2).length}\r\n\r\n${JSON.stringify(serverRequest2)}`);

        // Wait for both requests to be handled
        await requestHandled;
        
        // Verify both request IDs were received
        expect(requestIds).toContain(200);
        expect(requestIds).toContain(201);
        
        // Verify responses were sent
        const buffer = mockWriteStream.buffer();
        expect(buffer).toContain('"id":200');
        expect(buffer).toContain('"id":201');
    });
});