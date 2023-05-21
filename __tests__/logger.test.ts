import { Logger, LoggerLevel } from '../src/logger';
import {afterEach, beforeEach, describe, expect, it, SpyInstance, vi} from "vitest";


describe('ts-lsp-client logger', () => {

    let stdoutWriteSpy: SpyInstance;

    beforeEach(() => {
        stdoutWriteSpy = vi.spyOn(process.stdout, 'write');
    });

    afterEach(() => {
        stdoutWriteSpy.mockClear();
    });

    it('prints logs', async () => {
        Logger.setLogLevel('trace', false);
        Logger.log('Test Trace Message', LoggerLevel.TRACE);
        Logger.log('Test Debug Message', LoggerLevel.DEBUG);
        Logger.log('Test Info Message', LoggerLevel.INFO);
        Logger.log('Test Warn Message', LoggerLevel.WARN);
        Logger.log('Test Error Message', LoggerLevel.ERROR);
        Logger.log('Test Fatal Message', LoggerLevel.FATAL);

        const output = stdoutWriteSpy.mock.calls.reduce((acc, c) => { acc += c[0]; return acc }, '');

        expect(output).toContain('Test Trace Message');
        expect(output).toContain('Test Debug Message');
        expect(output).toContain('Test Info Message');
        expect(output).toContain('Test Warn Message');
        expect(output).toContain('Test Error Message');
        expect(output).toContain('Test Fatal Message');

        })

    it('doesn\'t print logs below the level specified during initialization', async () => {
        Logger.setLogLevel('warn', false);
        Logger.log('Test Trace Message', LoggerLevel.TRACE);
        Logger.log('Test Debug Message', LoggerLevel.DEBUG);
        Logger.log('Test Info Message', LoggerLevel.INFO);
        Logger.log('Test Warn Message', LoggerLevel.WARN);
        Logger.log('Test Error Message', LoggerLevel.ERROR);
        Logger.log('Test Fatal Message', LoggerLevel.FATAL);

        const output = stdoutWriteSpy.mock.calls.reduce((acc, c) => { acc += c[0]; return acc }, '');

        expect(output).not.toContain('Test Trace Message');
        expect(output).not.toContain('Test Debug Message');
        expect(output).not.toContain('Test Info Message');
        expect(output).toContain('Test Warn Message');
        expect(output).toContain('Test Error Message');
        expect(output).toContain('Test Fatal Message');

        })

    it('doesn\'t print when json output is requested', async () => {
        Logger.setLogLevel('warn', true);
        Logger.log('Test Trace Message', LoggerLevel.TRACE);
        Logger.log('Test Debug Message', LoggerLevel.DEBUG);
        Logger.log('Test Info Message', LoggerLevel.INFO);
        Logger.log('Test Warn Message', LoggerLevel.WARN);
        Logger.log('Test Error Message', LoggerLevel.ERROR);
        Logger.log('Test Fatal Message', LoggerLevel.FATAL);

        const output = stdoutWriteSpy.mock.calls.reduce((acc, c) => { acc += c[0]; return acc }, '');

        expect(output).not.toContain('Test Trace Message');
        expect(output).not.toContain('Test Debug Message');
        expect(output).not.toContain('Test Info Message');
        expect(output).not.toContain('Test Warn Message');
        expect(output).not.toContain('Test Error Message');
        expect(output).not.toContain('Test Fatal Message');

        })
})
