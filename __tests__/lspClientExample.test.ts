import {beforeAll, describe, expect, it} from "vitest";
import * as lspClient from '../src/main';
import {JSONRPCEndpoint, LspClient, SignatureHelpTriggerKind} from '../src/main';
import {ChildProcessWithoutNullStreams, spawn} from "child_process";
import * as path from 'path';
import {pathToFileURL} from "url";


const rootPath = path.resolve(path.join(__dirname, 'mock'));
let process: ChildProcessWithoutNullStreams;
let endpoint: JSONRPCEndpoint;
let client: LspClient;

beforeAll(async () => {
  // start the LSP server
  process = spawn(
    path.join(__dirname, '../', 'node_modules', '.bin', 'typescript-language-server'),
    ['--stdio'],
    {
      shell: true,
      stdio: 'pipe'
    }
  );

  // create an RPC endpoint for the process
  endpoint = new lspClient.JSONRPCEndpoint(
    process.stdin,
    process.stdout,
  );

  // create the LSP client
  client = new LspClient(endpoint);

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
        uri: pathToFileURL(rootPath).href
      }
    ],
    rootUri: null,
    initializationOptions: {
      tsserver: {
        logDirectory: '.log',
        logVerbosity: 'verbose',
        trace: 'verbose'
      }
    }
  });

  expect(result.capabilities).toBeDefined();
});

describe('language features', () => {
  const docUri = pathToFileURL(path.join(rootPath, '_fake.ts')).href;
  const impUri = pathToFileURL(path.join(rootPath, 'example.ts')).href.replace(/\/([A-Z]):/, (v) => v.substring(0, v.length - 1).toLocaleLowerCase()+'%3A');
  const content =
    `import func from './example';\r\n` +
    `func(1,2);\r\n` +
    `export default function meth(a: number, b: number): boolean {\r\n` +
    `  return !!a && !!b;\r\n` +
    `}\r\n` +
    `meth(1,2);`;

  beforeAll(async () => {
    {
      // open a pseudo document
      await client.didOpen({
        textDocument: {
          uri: docUri,
          text: content,
          version: 1,
          languageId: 'typescript'
        }
      });

      const result = await client.once('textDocument/publishDiagnostics');

      expect(result).toEqual([{
        uri: docUri,
        diagnostics: []
      }]);
    }
  });

  it('Goto Definition Request', async () => {
    const result = await client.definition({
      position: {
        line: 1,
        character: 0
      },
      textDocument: {
        uri: docUri
      },
    });

    // finds part of the import statement
    expect(result).toEqual([{
      uri: impUri,
      range: {
        start: { line: 6, character: 24},
        end: { line: 6, character: 28 }
      }
    }])
  });

  it('Signature Help', async () => {
    {
      const result = await client.signatureHelp({
        textDocument: {
          uri: docUri
        },
        position: {
          line: 1,
          character: 5
        },
        context: {
          triggerKind: SignatureHelpTriggerKind.ContentChange,
          isRetrigger: false,
          triggerCharacter: '('
        }
      });

      expect(result).not.toBeNull();
      expect(result).toEqual({
        activeSignature: 0,
        activeParameter: 0,
        signatures: [
          {
            label: 'func(a: number, b: number): boolean',
            documentation: {
              kind: 'markdown',
              value:
                'This is some example documentation\n' +
                '\n' +
                '*@return* — example return documentation'
            },
            parameters: [
              {
                documentation: {
                  kind: 'markdown',
                  value: 'example argument documentation'
                },
                label: 'a: number'
              },
              {
                label: 'b: number'
              }
            ]
          }
        ]
      });
    }
  })

  it('Signature Help (inline)', async () => {
    {
      const result = await client.signatureHelp({
        textDocument: {
          uri: docUri
        },
        position: {
          line: 5,
          character: 5
        },
        context: {
          triggerKind: SignatureHelpTriggerKind.ContentChange,
          isRetrigger: false,
          triggerCharacter: '('
        }
      });

      expect(result).not.toBeNull();
      expect(result).toEqual({
          activeSignature: 0,
          activeParameter: 0,
          signatures: [
            {
              label: 'meth(a: number, b: number): boolean',
              parameters: [
                {
                  label: 'a: number'
                },
                {
                  label: 'b: number'
                }
              ]
            }
          ]
        }
      )
    }
  })
});

