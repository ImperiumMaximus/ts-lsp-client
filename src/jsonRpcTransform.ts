import { Readable, Transform, TransformCallback, TransformOptions } from "stream";

const JSON_RPC_RES_REGEX = /^Content-Length: ([0-9]*)\r\n\r\n/i

type ReceiveState = 'content-length' | 'jsonrpc';

export class JSONRPCTransform extends Transform {
    private _state: ReceiveState;
    private _curContentLength: number;
    private _curChunk: string;

    private constructor(options?: TransformOptions) {
        options = options || {};
        options.objectMode = true;
        super(options);

        this.on('pipe', (src) => {
            if (!this.readableEncoding) {
                if (src instanceof Readable) {
                    this.setEncoding(src.readableEncoding);
                }
            }
        });

        this._curChunk = '';
        this._state = 'content-length';
    }

   public _transform(chunk: Buffer | string, encoding: BufferEncoding, done: TransformCallback): void {
        // decode binary chunks as UTF-8
        encoding = encoding || 'utf8';

        if (Buffer.isBuffer(chunk)) {
            chunk = chunk.toString(encoding);
        }
        
        this._curChunk += chunk;

        if (this._state === 'content-length') {
            const match = this._curChunk.toString().match(JSON_RPC_RES_REGEX);
            if (!match || !Array.isArray(match) || match.length < 2) {
                done(new Error(`[_transform] Bad header: ${this._curChunk || chunk}`));
                return;
            }
            this._curContentLength = Number(match[1]);
            this._curChunk = this._curChunk.substring(match[0].length);
            this._state = 'jsonrpc';
        }
        
        if (this._state === 'jsonrpc') {
            if (this._curChunk.length >= this._curContentLength) {
                this.push(this._reencode(this._curChunk.length > this._curContentLength ? this._curChunk.substring(0, this._curContentLength) : this._curChunk, encoding));
                this._curChunk = this._curChunk.length > this._curContentLength ? this._curChunk.substring(this._curContentLength) : '';
                this._state = 'content-length';
                                
                const match = this._curChunk.match(JSON_RPC_RES_REGEX);
                if (match && Array.isArray(match) && match.length >= 2 && (this._curChunk.length - match[0].length) >= Number(match[1])) {
                    const c = this._curChunk;
                    this._curChunk = '';
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    this._transform(c, encoding, () => { });
                }
            }
        }
        done();
    }

    private _reencode (chunk: string, chunkEncoding: BufferEncoding) {
        if (this.readableEncoding && this.readableEncoding != chunkEncoding) {
            return Buffer.from(chunk, chunkEncoding).toString(this.readableEncoding);
        } else if (this.readableEncoding) {
            // this should be the most common case, i.e. we're using an encoded source stream
            return chunk;
        } else {
            return Buffer.from(chunk, chunkEncoding);
        }
    };

    public static createStream(readStream?: Readable, options?: TransformOptions): JSONRPCTransform {
        const jrt = new JSONRPCTransform(options);
        if (readStream) {
            readStream.pipe(jrt);
        }
        return jrt;
    }
}