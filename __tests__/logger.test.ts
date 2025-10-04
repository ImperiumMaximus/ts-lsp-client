import path from 'path';
import { Logger, LoggerLevel } from '../src/logger';
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import os from 'os';
import fs from 'fs';

describe('ts-lsp-client logger', () => {

    let filePath = '';
    let fd = -1;

    function createTempFile() {
        const filePath = path.join(os.tmpdir(), `pino-test-${Date.now()}.log`)
        const fd = fs.openSync(filePath, "w+")
        return { fd, filePath }
    }

    beforeEach(() => {
        ({ fd, filePath } = createTempFile());
    });

    afterEach(() => {
        fs.closeSync(fd)
        fs.unlinkSync(filePath) // cleanup
    });

    it('prints logs', async () => {
        Logger.setLogLevel('trace', false, fd, true);
        Logger.log('Test Trace Message', LoggerLevel.TRACE);
        Logger.log('Test Debug Message', LoggerLevel.DEBUG);
        Logger.log('Test Info Message', LoggerLevel.INFO);
        Logger.log('Test Warn Message', LoggerLevel.WARN);
        Logger.log('Test Error Message', LoggerLevel.ERROR);
        Logger.log('Test Fatal Message', LoggerLevel.FATAL);

        const output = fs.readFileSync(filePath, "utf8")

        expect(output).toContain('Test Trace Message');
        expect(output).toContain('Test Debug Message');
        expect(output).toContain('Test Info Message');
        expect(output).toContain('Test Warn Message');
        expect(output).toContain('Test Error Message');
        expect(output).toContain('Test Fatal Message');
    })

    it('doesn\'t print logs below the level specified during initialization', async () => {
        Logger.setLogLevel('warn', false, fd, true);
        Logger.log('Test Trace Message', LoggerLevel.TRACE);
        Logger.log('Test Debug Message', LoggerLevel.DEBUG);
        Logger.log('Test Info Message', LoggerLevel.INFO);
        Logger.log('Test Warn Message', LoggerLevel.WARN);
        Logger.log('Test Error Message', LoggerLevel.ERROR);
        Logger.log('Test Fatal Message', LoggerLevel.FATAL);

        const output = fs.readFileSync(filePath, "utf8");

        expect(output).not.toContain('Test Trace Message');
        expect(output).not.toContain('Test Debug Message');
        expect(output).not.toContain('Test Info Message');
        expect(output).toContain('Test Warn Message');
        expect(output).toContain('Test Error Message');
        expect(output).toContain('Test Fatal Message');

    })

    it('doesn\'t print when json output is requested', async () => {
        Logger.setLogLevel('warn', true, fd, true);
        Logger.log('Test Trace Message', LoggerLevel.TRACE);
        Logger.log('Test Debug Message', LoggerLevel.DEBUG);
        Logger.log('Test Info Message', LoggerLevel.INFO);
        Logger.log('Test Warn Message', LoggerLevel.WARN);
        Logger.log('Test Error Message', LoggerLevel.ERROR);
        Logger.log('Test Fatal Message', LoggerLevel.FATAL);

        const output = fs.readFileSync(filePath, "utf8");

        expect(output).not.toContain('Test Trace Message');
        expect(output).not.toContain('Test Debug Message');
        expect(output).not.toContain('Test Info Message');
        expect(output).not.toContain('Test Warn Message');
        expect(output).not.toContain('Test Error Message');
        expect(output).not.toContain('Test Fatal Message');

    })
})
