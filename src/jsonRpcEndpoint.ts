import { JSONRPCClient, JSONRPCRequest, JSONRPCResponse } from 'json-rpc-2.0';
import { EventEmitter, Readable, Writable } from 'stream';
import { JSONRPCTransform } from './jsonRpcTransform';

export class JSONRPCEndpoint extends EventEmitter {

    private writable: Writable;
    private readable: Readable;
    private readableByline: JSONRPCTransform;
    private client: JSONRPCClient;
    private nextId: number;

    public constructor(writable: Writable, readable: Readable, options?) {
        super(options);
        this.nextId = 0;
        const createId = () => this.nextId++;
        this.writable = writable;
        this.readable = readable;
        this.readableByline = JSONRPCTransform.createStream(this.readable, options);

        this.client = new JSONRPCClient(async (jsonRPCRequest) => {
            const jsonRPCRequestStr = JSON.stringify(jsonRPCRequest);
            console.log(`sending: ${jsonRPCRequestStr}`)
            this.writable.write(`Content-Length: ${jsonRPCRequestStr.length}\r\n\r\n${jsonRPCRequestStr}`);
        }, createId);

        this.readableByline.on('data', (jsonRPCResponseOrRequest: string) => {
            const jsonrpc = JSON.parse(jsonRPCResponseOrRequest);
            console.log(`[transform] ${jsonRPCResponseOrRequest}`);

            if (Object.prototype.hasOwnProperty.call(jsonrpc, 'id')) {
                const jsonRPCResponse: JSONRPCResponse = jsonrpc as JSONRPCResponse;
                if (jsonRPCResponse.id === (this.nextId - 1)) {
                    this.client.receive(jsonRPCResponse);
                } else {
                    this.emit('error', `[transform] Received id mismatch! Got ${jsonRPCResponse.id}, expected ${this.nextId - 1}`);
                }
            } else {
                const jsonRPCRequest: JSONRPCRequest = jsonrpc as JSONRPCRequest;
                this.emit(jsonRPCRequest.method, jsonRPCRequest.params);
            }
        });
    }

    public send(method: string, message?: any): PromiseLike<any> {
        return this.client.request(method, message);
    }

    public notify(method: string, message?: any): void {
        this.client.notify(method, message);
    }
}