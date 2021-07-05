# ts-lsp-client

[![Version][npm-badge]][npm]
[![Downloads/week][npm-dw-badge]][npm]
[![TypeScript version][ts-badge]][typescript-4-3]
[![Node.js version][nodejs-badge]][nodejs]
[![MIT][license-badge]][license]
[![Build Status - GitHub Actions][gha-badge]][gha-ci]
[![Codecov][codecov-badge]][codecov]

This npm module allows to communicate to a Language Server via Language Server Protocol (LSP).
The aim is to provide a standalone library with minimal dependencies in contrast to the official one implemented by MS which depends on VSCode node libraries.  
The interface is heavily inspired by a Python library counterpart called [pylspclient][pylspclient].

For more information on the LSP specification itself please see [here][lsp].

## Installation

```
npm install ts-lsp-client
```

## Run the tests

```
npm run test
```

## License

Licensed under the MIT License. See the [LICENSE](https://github.com/ImperiumMaximus/ts-lsp-client/blob/main/LICENSE) file for details.

[ts-badge]: https://img.shields.io/badge/TypeScript-4.3-blue.svg
[nodejs-badge]: https://img.shields.io/badge/Node.js->=%2014.16-yellow.svg
[nodejs]: https://nodejs.org/dist/latest-v14.x/docs/api/
[gha-badge]: https://github.com/ImperiumMaximus/ts-lsp-client/actions/workflows/nodejs.yml/badge.svg
[gha-ci]: https://github.com/ImperiumMaximus/ts-lsp-client/actions/workflows/nodejs.yml
[typescript]: https://www.typescriptlang.org/
[typescript-4-3]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-3.html
[license-badge]: https://img.shields.io/badge/license-MIT-orange.svg
[license]: https://github.com/ImperiumMaximus/ts-lsp-client/blob/main/LICENSE
[jest]: https://facebook.github.io/jest/
[eslint]: https://github.com/eslint/eslint
[prettier]: https://prettier.io
[volta]: https://volta.sh
[volta-getting-started]: https://docs.volta.sh/guide/getting-started
[volta-tomdale]: https://twitter.com/tomdale/status/1162017336699838467?s=20
[gh-actions]: https://github.com/features/actions
[codecov-badge]: https://codecov.io/gh/ImperiumMaximus/ts-lsp-client/branch/main/graph/badge.svg?token=fWTfaFk0Oz
[codecov]: https://codecov.io/gh/ImperiumMaximus/ts-lsp-client
[pylspclient]: https://github.com/yeger00/pylspclient
[lsp]: https://microsoft.github.io/language-server-protocol/
[npm-badge]: https://img.shields.io/npm/v/ts-lsp-client.svg
[npm]: https://npmjs.org/package/ts-lsp-client
[npm-dw-badge]: https://img.shields.io/npm/dw/ts-lsp-client.svg