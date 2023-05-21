import {expect, it} from "vitest";
import * as lspClient from '../src/main';
import {SignatureHelpTriggerKind} from '../src/main';
import {spawn} from "child_process";
import * as process from 'node:process';
import * as path from 'node:path';
import {pathToFileURL} from "url";

it('should use typescript-language-server', async () => {

  const lspProcess = spawn(
    path.join(__dirname, '../', 'node_modules', '.bin', 'typescript-language-server'),
    ['--stdio'],
    {
      shell: true
    }
  );

  const endpoint = new lspClient.JSONRPCEndpoint(
    lspProcess.stdin,
    lspProcess.stdout
  );

  const client = new lspClient.LspClient(endpoint);

  {
    // initialize the language server
    const result = await client.initialize({
      processId: process.pid,
      capabilities: {},
      clientInfo: {
        name: 'lspClientExample',
        version: '0.0.9'
      },
      workspaceFolders: [
        {
          name: 'workspace',
          uri: pathToFileURL(path.resolve(path.join(__dirname, '../'))).href
        }
      ],
      rootUri: null,
      initializationOptions: {
        tsserver: {
          logVerbosity: 'verbose'
        }
      }
    });

    expect(result.capabilities.definitionProvider).toBeTruthy();
  }

  const docUri = pathToFileURL(path.resolve(path.join(__dirname, '_example.ts'))).href;

  {
    // open a pseudo document
    await client.didOpen({
      textDocument: {
        uri: docUri,
        text: 'function test() {};\r\ntest()',
        version: 1,
        languageId: 'typescript'
      }
    });
  }

  {
    const result = await client.definition({
      position: {
        line: 0,
        character: 9
      },
      textDocument: {
        uri: docUri
      },
    });

    expect(result).toEqual([{
      uri: docUri,
      range: {
        start: { line: 0, character: 9},
        end: { line: 0, character: 13 }
      }
    }])
  }

  {
    const result = await client.signatureHelp({
      position: {
        line: 1,
        character: 5
      },
      textDocument: {
        uri: docUri
      },
      context: {
        triggerKind: SignatureHelpTriggerKind.Invoked,
        isRetrigger: false,
        triggerCharacter: '('
      }
    });

    expect(result).toEqual({
        activeSignature: 0,
        activeParameter: 0,
        signatures: [ { label: 'test(): void', parameters: [] } ]
      }
    )
  }

  expect(0).toBe(0);
}, 20000);
