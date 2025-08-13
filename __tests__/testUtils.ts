import { Writable } from "stream";

export class WriteMemory extends Writable {
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