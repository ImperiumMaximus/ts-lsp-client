
/**
 * Defines an integer number in the range of -2^31 to 2^31 - 1.
 */
export type integer = number;
/**
 * Defines an unsigned integer number in the range of 0 to 2^31 - 1.
 */
export type uinteger = number;
/**
 * Defines a decimal number. Since decimal numbers are very
 * rare in the language server specification we denote the
 * exact range with every decimal using the mathematics
 * interval notation (e.g. [0, 1] denotes all decimals d with
 * 0 <= d <= 1.
 */
export type decimal = number;

type ProgressToken = integer | string;

type DocumentUri = string;

export type TraceValue = 'off' | 'messages' | 'verbose';

/**
 * An identifier referring to a change annotation managed by a workspace
 * edit.
 *
 * @since 3.16.0.
 */
export type ChangeAnnotationIdentifier = string;

export interface ResponseError {
    /**
     * A number indicating the error type that occurred.
     */
    code: integer;

    /**
     * A string providing a short description of the error.
     */
    message: string;

    /**
     * A primitive or structured value that contains additional
     * information about the error. Can be omitted.
     */
    data?: string | number | boolean | [] | Record<string, unknown> | null;
}

export interface WorkDoneProgressParams {
    /**
     * An optional token that a server can use to report work done progress.
     */
    workDoneToken?: ProgressToken;
}

export interface InitializeParams extends WorkDoneProgressParams {
    /**
     * The process Id of the parent process that started the server. Is null if
     * the process has not been started by another process. If the parent
     * process is not alive then the server should exit (see exit notification)
     * its process.
     */
    processId: integer | null;

    /**
     * Information about the client
     *
     * @since 3.15.0
     */
    clientInfo?: {
        /**
         * The name of the client as defined by the client.
         */
        name: string;

        /**
         * The client's version as defined by the client.
         */
        version?: string;
    };

    /**
     * The locale the client is currently showing the user interface
     * in. This must not necessarily be the locale of the operating
     * system.
     *
     * Uses IETF language tags as the value's syntax
     * (See https://en.wikipedia.org/wiki/IETF_language_tag)
     *
     * @since 3.16.0
     */
    locale?: string;

    /**
     * The rootPath of the workspace. Is null
     * if no folder is open.
     *
     * @deprecated in favour of `rootUri`.
     */
    rootPath?: string | null;

    /**
     * The rootUri of the workspace. Is null if no
     * folder is open. If both `rootPath` and `rootUri` are set
     * `rootUri` wins.
     *
     * @deprecated in favour of `workspaceFolders`
     */
    rootUri: DocumentUri | null;

    /**
     * User provided initialization options.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initializationOptions?: any;

    /**
     * The capabilities provided by the client (editor or tool)
     */
    capabilities: ClientCapabilities;

    /**
     * The initial trace setting. If omitted trace is disabled ('off').
     */
    trace?: TraceValue;

    /**
     * The workspace folders configured in the client when the server starts.
     * This property is only available if the client supports workspace folders.
     * It can be `null` if the client supports workspace folders but none are
     * configured.
     *
     * @since 3.6.0
     */
    workspaceFolders?: WorkspaceFolder[] | null;
}

export interface ClientCapabilities {
    /**
     * Workspace specific client capabilities.
     */
    workspace?: {
        /**
         * The client supports applying batch edits
         * to the workspace by supporting the request
         * 'workspace/applyEdit'
         */
        applyEdit?: boolean;

        /**
         * Capabilities specific to `WorkspaceEdit`s
         */
        workspaceEdit?: WorkspaceEditClientCapabilities;

        /**
         * Capabilities specific to the `workspace/didChangeConfiguration`
         * notification.
         */
        didChangeConfiguration?: DidChangeConfigurationClientCapabilities;

        /**
         * Capabilities specific to the `workspace/didChangeWatchedFiles`
         * notification.
         */
        didChangeWatchedFiles?: DidChangeWatchedFilesClientCapabilities;

        /**
         * Capabilities specific to the `workspace/symbol` request.
         */
        symbol?: WorkspaceSymbolClientCapabilities;

        /**
         * Capabilities specific to the `workspace/executeCommand` request.
         */
        executeCommand?: ExecuteCommandClientCapabilities;

        /**
         * The client has support for workspace folders.
         *
         * @since 3.6.0
         */
        workspaceFolders?: boolean;

        /**
         * The client supports `workspace/configuration` requests.
         *
         * @since 3.6.0
         */
        configuration?: boolean;

        /**
         * Capabilities specific to the semantic token requests scoped to the
         * workspace.
         *
         * @since 3.16.0
         */
        semanticTokens?: SemanticTokensWorkspaceClientCapabilities;

        /**
         * Capabilities specific to the code lens requests scoped to the
         * workspace.
         *
         * @since 3.16.0
         */
        codeLens?: CodeLensWorkspaceClientCapabilities;

        /**
         * The client has support for file requests/notifications.
         *
         * @since 3.16.0
         */
        fileOperations?: {
            /**
             * Whether the client supports dynamic registration for file
             * requests/notifications.
             */
            dynamicRegistration?: boolean;

            /**
             * The client has support for sending didCreateFiles notifications.
             */
            didCreate?: boolean;

            /**
             * The client has support for sending willCreateFiles requests.
             */
            willCreate?: boolean;

            /**
             * The client has support for sending didRenameFiles notifications.
             */
            didRename?: boolean;

            /**
             * The client has support for sending willRenameFiles requests.
             */
            willRename?: boolean;

            /**
             * The client has support for sending didDeleteFiles notifications.
             */
            didDelete?: boolean;

            /**
             * The client has support for sending willDeleteFiles requests.
             */
            willDelete?: boolean;
        };
    };

    /**
     * Text document specific client capabilities.
     */
    textDocument?: TextDocumentClientCapabilities;

    /**
     * Window specific client capabilities.
     */
    window?: {
        /**
         * Whether client supports handling progress notifications. If set
         * servers are allowed to report in `workDoneProgress` property in the
         * request specific server capabilities.
         *
         * @since 3.15.0
         */
        workDoneProgress?: boolean;

        /**
         * Capabilities specific to the showMessage request
         *
         * @since 3.16.0
         */
        showMessage?: ShowMessageRequestClientCapabilities;

        /**
         * Client capabilities for the show document request.
         *
         * @since 3.16.0
         */
        showDocument?: ShowDocumentClientCapabilities;
    };

    /**
     * General client capabilities.
     *
     * @since 3.16.0
     */
    general?: {
        /**
         * Client capability that signals how the client
         * handles stale requests (e.g. a request
         * for which the client will not process the response
         * anymore since the information is outdated).
         *
         * @since 3.17.0
         */
        staleRequestSupport?: {
            /**
             * The client will actively cancel the request.
             */
            cancel: boolean;

            /**
             * The list of requests for which the client
             * will retry the request if it receives a
             * response with error code `ContentModified``
             */
            retryOnContentModified: string[];
        }

        /**
         * Client capabilities specific to regular expressions.
         *
         * @since 3.16.0
         */
        regularExpressions?: RegularExpressionsClientCapabilities;

        /**
         * Client capabilities specific to the client's markdown parser.
         *
         * @since 3.16.0
         */
        markdown?: MarkdownClientCapabilities;
    };

    /**
     * Experimental client capabilities.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    experimental?: any;
}

export interface WorkspaceFolder {
    /**
     * The associated URI for this workspace folder.
     */
    uri: DocumentUri;

    /**
     * The name of the workspace folder. Used to refer to this
     * workspace folder in the user interface.
     */
    name: string;
}

export interface ApplyWorkspaceEditParams {
    /**
     * An optional label of the workspace edit. This label is
     * presented in the user interface for example on an undo
     * stack to undo the workspace edit.
     */
    label?: string;

    /**
     * The edits to apply.
     */
    edit: WorkspaceEdit;
}

export interface WorkspaceEdit {
    /**
     * Holds changes to existing resources.
     */
    changes?: { [uri: string]: TextEdit[]; };

    /**
     * Depending on the client capability
     * `workspace.workspaceEdit.resourceOperations` document changes are either
     * an array of `TextDocumentEdit`s to express changes to n different text
     * documents where each text document edit addresses a specific version of
     * a text document. Or it can contain above `TextDocumentEdit`s mixed with
     * create, rename and delete file / folder operations.
     *
     * Whether a client supports versioned document edits is expressed via
     * `workspace.workspaceEdit.documentChanges` client capability.
     *
     * If a client neither supports `documentChanges` nor
     * `workspace.workspaceEdit.resourceOperations` then only plain `TextEdit`s
     * using the `changes` property are supported.
     */
    documentChanges?: (
        TextDocumentEdit[] |
        (TextDocumentEdit | CreateFile | RenameFile | DeleteFile)[]
    );

    /**
     * A map of change annotations that can be referenced in
     * `AnnotatedTextEdit`s or create, rename and delete file / folder
     * operations.
     *
     * Whether clients honor this property depends on the client capability
     * `workspace.changeAnnotationSupport`.
     *
     * @since 3.16.0
     */
    changeAnnotations?: {
        [id: string /* ChangeAnnotationIdentifier */]: ChangeAnnotation;
    };
}

interface TextEdit {
    /**
     * The range of the text document to be manipulated. To insert
     * text into a document create a range where start === end.
     */
    range: Range;

    /**
     * The string to be inserted. For delete operations use an
     * empty string.
     */
    newText: string;
}

interface Range {
    /**
     * The range's start position.
     */
    start: Position;

    /**
     * The range's end position.
     */
    end: Position;
}

interface Position {
    /**
     * Line position in a document (zero-based).
     */
    line: uinteger;

    /**
     * Character offset on a line in a document (zero-based). Assuming that
     * the line is represented as a string, the `character` value represents
     * the gap between the `character` and `character + 1`.
     *
     * If the character value is greater than the line length it defaults back
     * to the line length.
     */
    character: uinteger;
}

export interface TextDocumentEdit {
    /**
     * The text document to change.
     */
    textDocument: OptionalVersionedTextDocumentIdentifier;

    /**
     * The edits to be applied.
     *
     * @since 3.16.0 - support for AnnotatedTextEdit. This is guarded by the
     * client capability `workspace.workspaceEdit.changeAnnotationSupport`
     */
    edits: (TextEdit | AnnotatedTextEdit)[];
}

interface TextDocumentIdentifier {
    /**
     * The text document's URI.
     */
    uri: DocumentUri;
}


interface OptionalVersionedTextDocumentIdentifier extends TextDocumentIdentifier {
    /**
     * The version number of this document. If an optional versioned text document
     * identifier is sent from the server to the client and the file is not
     * open in the editor (the server has not received an open notification
     * before) the server can send `null` to indicate that the version is
     * known and the content on disk is the master (as specified with document
     * content ownership).
     *
     * The version number of a document will increase after each change,
     * including undo/redo. The number doesn't need to be consecutive.
     */
    version: integer | null;
}

/**
 * A special text edit with an additional change annotation.
 *
 * @since 3.16.0.
 */
export interface AnnotatedTextEdit extends TextEdit {
    /**
     * The actual annotation identifier.
     */
    annotationId: ChangeAnnotationIdentifier;
}

/**
 * Create file operation
 */
export interface CreateFile {
    /**
     * A create
     */
    kind: 'create';

    /**
     * The resource to create.
     */
    uri: DocumentUri;

    /**
     * Additional options
     */
    options?: CreateFileOptions;

    /**
     * An optional annotation identifer describing the operation.
     *
     * @since 3.16.0
     */
    annotationId?: ChangeAnnotationIdentifier;
}

/**
 * Options to create a file.
 */
export interface CreateFileOptions {
    /**
     * Overwrite existing file. Overwrite wins over `ignoreIfExists`
     */
    overwrite?: boolean;

    /**
     * Ignore if exists.
     */
    ignoreIfExists?: boolean;
}

/**
 * Rename file operation
 */
export interface RenameFile {
    /**
     * A rename
     */
    kind: 'rename';

    /**
     * The old (existing) location.
     */
    oldUri: DocumentUri;

    /**
     * The new location.
     */
    newUri: DocumentUri;

    /**
     * Rename options.
     */
    options?: RenameFileOptions;

    /**
     * An optional annotation identifer describing the operation.
     *
     * @since 3.16.0
     */
    annotationId?: ChangeAnnotationIdentifier;
}

/**
 * Rename file options
 */
export interface RenameFileOptions {
    /**
     * Overwrite target if existing. Overwrite wins over `ignoreIfExists`
     */
    overwrite?: boolean;

    /**
     * Ignores if target exists.
     */
    ignoreIfExists?: boolean;
}

/**
 * Delete file operation
 */
export interface DeleteFile {
    /**
     * A delete
     */
    kind: 'delete';

    /**
     * The file to delete.
     */
    uri: DocumentUri;

    /**
     * Delete options.
     */
    options?: DeleteFileOptions;

    /**
     * An optional annotation identifer describing the operation.
     *
     * @since 3.16.0
     */
    annotationId?: ChangeAnnotationIdentifier;
}

/**
 * Delete file options
 */
export interface DeleteFileOptions {
    /**
     * Delete the content recursively if a folder is denoted.
     */
    recursive?: boolean;

    /**
     * Ignore the operation if the file doesn't exist.
     */
    ignoreIfNotExists?: boolean;
}

/**
 * Additional information that describes document changes.
 *
 * @since 3.16.0
 */
export interface ChangeAnnotation {
    /**
     * A human-readable string describing the actual change. The string
     * is rendered prominent in the user interface.
     */
    label: string;

    /**
     * A flag which indicates that user confirmation is needed
     * before applying the change.
     */
    needsConfirmation?: boolean;

    /**
     * A human-readable string which is rendered less prominent in
     * the user interface.
     */
    description?: string;
}

export interface WorkspaceEditClientCapabilities {
    /**
     * The client supports versioned document changes in `WorkspaceEdit`s
     */
    documentChanges?: boolean;

    /**
     * The resource operations the client supports. Clients should at least
     * support 'create', 'rename' and 'delete' files and folders.
     *
     * @since 3.13.0
     */
    resourceOperations?: ResourceOperationKind[];

    /**
     * The failure handling strategy of a client if applying the workspace edit
     * fails.
     *
     * @since 3.13.0
     */
    failureHandling?: FailureHandlingKind;

    /**
     * Whether the client normalizes line endings to the client specific
     * setting.
     * If set to `true` the client will normalize line ending characters
     * in a workspace edit to the client specific new line character(s).
     *
     * @since 3.16.0
     */
    normalizesLineEndings?: boolean;

    /**
     * Whether the client in general supports change annotations on text edits,
     * create file, rename file and delete file changes.
     *
     * @since 3.16.0
     */
    changeAnnotationSupport?: {
        /**
         * Whether the client groups edits with equal labels into tree nodes,
         * for instance all edits labelled with "Changes in Strings" would
         * be a tree node.
         */
        groupsOnLabel?: boolean;
    };
}

/**
 * The kind of resource operations supported by the client.
 */
export type ResourceOperationKind = 'create' | 'rename' | 'delete';

export type FailureHandlingKind = 'abort' | 'transactional' | 'undo'
    | 'textOnlyTransactional';

export interface DidChangeConfigurationClientCapabilities {
    /**
     * Did change configuration notification supports dynamic registration.
     */
    dynamicRegistration?: boolean;
}

export interface DidChangeWatchedFilesClientCapabilities {
    /**
     * Did change watched files notification supports dynamic registration.
     * Please note that the current protocol doesn't support static
     * configuration for file changes from the server side.
     */
    dynamicRegistration?: boolean;
}

interface WorkspaceSymbolClientCapabilities {
    /**
     * Symbol request supports dynamic registration.
     */
    dynamicRegistration?: boolean;

    /**
     * Specific capabilities for the `SymbolKind` in the `workspace/symbol`
     * request.
     */
    symbolKind?: {
        /**
         * The symbol kind values the client supports. When this
         * property exists the client also guarantees that it will
         * handle values outside its set gracefully and falls back
         * to a default value when unknown.
         *
         * If this property is not present the client only supports
         * the symbol kinds from `File` to `Array` as defined in
         * the initial version of the protocol.
         */
        valueSet?: SymbolKind[];
    };

    /**
     * The client supports tags on `SymbolInformation`.
     * Clients supporting tags have to handle unknown tags gracefully.
     *
     * @since 3.16.0
     */
    tagSupport?: {
        /**
         * The tags supported by the client.
         */
        valueSet: SymbolTag[];
    };
}

/**
 * A symbol kind.
 */
export enum SymbolKind {
    File = 1,
    Module = 2,
    Namespace = 3,
    Package = 4,
    Class = 5,
    Method = 6,
    Property = 7,
    Field = 8,
    Constructor = 9,
    Enum = 10,
    Interface = 11,
    Function = 12,
    Variable = 13,
    Constant = 14,
    String = 15,
    Number = 16,
    Boolean = 17,
    Array = 18,
    Object = 19,
    Key = 20,
    Null = 21,
    EnumMember = 22,
    Struct = 23,
    Event = 24,
    Operator = 25,
    TypeParameter = 26
}

export type SymbolTag = 1;

export interface ExecuteCommandClientCapabilities {
    /**
     * Execute command supports dynamic registration.
     */
    dynamicRegistration?: boolean;
}

export interface SemanticTokensWorkspaceClientCapabilities {
    /**
     * Whether the client implementation supports a refresh request sent from
     * the server to the client.
     *
     * Note that this event is global and will force the client to refresh all
     * semantic tokens currently shown. It should be used with absolute care
     * and is useful for situation where a server for example detect a project
     * wide change that requires such a calculation.
     */
    refreshSupport?: boolean;
}

export interface CodeLensWorkspaceClientCapabilities {
    /**
     * Whether the client implementation supports a refresh request sent from the
     * server to the client.
     *
     * Note that this event is global and will force the client to refresh all
     * code lenses currently shown. It should be used with absolute care and is
     * useful for situation where a server for example detect a project wide
     * change that requires such a calculation.
     */
    refreshSupport?: boolean;
}

/**
 * Text document specific client capabilities.
 */
export interface TextDocumentClientCapabilities {

    synchronization?: TextDocumentSyncClientCapabilities;

    /**
     * Capabilities specific to the `textDocument/completion` request.
     */
    completion?: CompletionClientCapabilities;

    /**
     * Capabilities specific to the `textDocument/hover` request.
     */
    hover?: HoverClientCapabilities;

    /**
     * Capabilities specific to the `textDocument/signatureHelp` request.
     */
    signatureHelp?: SignatureHelpClientCapabilities;

    /**
     * Capabilities specific to the `textDocument/declaration` request.
     *
     * @since 3.14.0
     */
    declaration?: DeclarationClientCapabilities;

    /**
     * Capabilities specific to the `textDocument/definition` request.
     */
    definition?: DefinitionClientCapabilities;

    /**
     * Capabilities specific to the `textDocument/typeDefinition` request.
     *
     * @since 3.6.0
     */
    typeDefinition?: TypeDefinitionClientCapabilities;

    /**
     * Capabilities specific to the `textDocument/implementation` request.
     *
     * @since 3.6.0
     */
    implementation?: ImplementationClientCapabilities;

    /**
     * Capabilities specific to the `textDocument/references` request.
     */
    references?: ReferenceClientCapabilities;

    /**
     * Capabilities specific to the `textDocument/documentHighlight` request.
     */
    documentHighlight?: DocumentHighlightClientCapabilities;

    /**
     * Capabilities specific to the `textDocument/documentSymbol` request.
     */
    documentSymbol?: DocumentSymbolClientCapabilities;

    /**
     * Capabilities specific to the `textDocument/codeAction` request.
     */
    codeAction?: CodeActionClientCapabilities;

    /**
     * Capabilities specific to the `textDocument/codeLens` request.
     */
    codeLens?: CodeLensClientCapabilities;

    /**
     * Capabilities specific to the `textDocument/documentLink` request.
     */
    documentLink?: DocumentLinkClientCapabilities;

    /**
     * Capabilities specific to the `textDocument/documentColor` and the
     * `textDocument/colorPresentation` request.
     *
     * @since 3.6.0
     */
    colorProvider?: DocumentColorClientCapabilities;

    /**
     * Capabilities specific to the `textDocument/formatting` request.
     */
    formatting?: DocumentFormattingClientCapabilities;

    /**
     * Capabilities specific to the `textDocument/rangeFormatting` request.
     */
    rangeFormatting?: DocumentRangeFormattingClientCapabilities;

    /** request.
     * Capabilities specific to the `textDocument/onTypeFormatting` request.
     */
    onTypeFormatting?: DocumentOnTypeFormattingClientCapabilities;

    /**
     * Capabilities specific to the `textDocument/rename` request.
     */
    rename?: RenameClientCapabilities;

    /**
     * Capabilities specific to the `textDocument/publishDiagnostics`
     * notification.
     */
    publishDiagnostics?: PublishDiagnosticsClientCapabilities;

    /**
     * Capabilities specific to the `textDocument/foldingRange` request.
     *
     * @since 3.10.0
     */
    foldingRange?: FoldingRangeClientCapabilities;

    /**
     * Capabilities specific to the `textDocument/selectionRange` request.
     *
     * @since 3.15.0
     */
    selectionRange?: SelectionRangeClientCapabilities;

    /**
     * Capabilities specific to the `textDocument/linkedEditingRange` request.
     *
     * @since 3.16.0
     */
    linkedEditingRange?: LinkedEditingRangeClientCapabilities;

    /**
     * Capabilities specific to the various call hierarchy requests.
     *
     * @since 3.16.0
     */
    callHierarchy?: CallHierarchyClientCapabilities;

    /**
     * Capabilities specific to the various semantic token requests.
     *
     * @since 3.16.0
     */
    semanticTokens?: SemanticTokensClientCapabilities;

    /**
     * Capabilities specific to the `textDocument/moniker` request.
     *
     * @since 3.16.0
     */
    moniker?: MonikerClientCapabilities;
}

export interface TextDocumentSyncClientCapabilities {
    /**
     * Whether text document synchronization supports dynamic registration.
     */
    dynamicRegistration?: boolean;

    /**
     * The client supports sending will save notifications.
     */
    willSave?: boolean;

    /**
     * The client supports sending a will save request and
     * waits for a response providing text edits which will
     * be applied to the document before it is saved.
     */
    willSaveWaitUntil?: boolean;

    /**
     * The client supports did save notifications.
     */
    didSave?: boolean;
}

export interface CompletionClientCapabilities {
    /**
     * Whether completion supports dynamic registration.
     */
    dynamicRegistration?: boolean;

    /**
     * The client supports the following `CompletionItem` specific
     * capabilities.
     */
    completionItem?: {
        /**
         * Client supports snippets as insert text.
         *
         * A snippet can define tab stops and placeholders with `$1`, `$2`
         * and `${3:foo}`. `$0` defines the final tab stop, it defaults to
         * the end of the snippet. Placeholders with equal identifiers are
         * linked, that is typing in one will update others too.
         */
        snippetSupport?: boolean;

        /**
         * Client supports commit characters on a completion item.
         */
        commitCharactersSupport?: boolean;

        /**
         * Client supports the follow content formats for the documentation
         * property. The order describes the preferred format of the client.
         */
        documentationFormat?: MarkupKind[];

        /**
         * Client supports the deprecated property on a completion item.
         */
        deprecatedSupport?: boolean;

        /**
         * Client supports the preselect property on a completion item.
         */
        preselectSupport?: boolean;

        /**
         * Client supports the tag property on a completion item. Clients
         * supporting tags have to handle unknown tags gracefully. Clients
         * especially need to preserve unknown tags when sending a completion
         * item back to the server in a resolve call.
         *
         * @since 3.15.0
         */
        tagSupport?: {
            /**
             * The tags supported by the client.
             */
            valueSet: CompletionItemTag[];
        };

        /**
         * Client supports insert replace edit to control different behavior if
         * a completion item is inserted in the text or should replace text.
         *
         * @since 3.16.0
         */
        insertReplaceSupport?: boolean;

        /**
         * Indicates which properties a client can resolve lazily on a
         * completion item. Before version 3.16.0 only the predefined properties
         * `documentation` and `detail` could be resolved lazily.
         *
         * @since 3.16.0
         */
        resolveSupport?: {
            /**
             * The properties that a client can resolve lazily.
             */
            properties: string[];
        };

        /**
         * The client supports the `insertTextMode` property on
         * a completion item to override the whitespace handling mode
         * as defined by the client (see `insertTextMode`).
         *
         * @since 3.16.0
         */
        insertTextModeSupport?: {
            valueSet: InsertTextMode[];
        };

        /**
         * The client has support for completion item label
         * details (see also `CompletionItemLabelDetails`).
         *
         * @since 3.17.0 - proposed state
         */
        labelDetailsSupport?: boolean;
    };

    completionItemKind?: {
        /**
         * The completion item kind values the client supports. When this
         * property exists the client also guarantees that it will
         * handle values outside its set gracefully and falls back
         * to a default value when unknown.
         *
         * If this property is not present the client only supports
         * the completion items kinds from `Text` to `Reference` as defined in
         * the initial version of the protocol.
         */
        valueSet?: CompletionItemKind[];
    };

    /**
     * The client supports to send additional context information for a
     * `textDocument/completion` request.
     */
    contextSupport?: boolean;

    /**
     * The client's default when the completion item doesn't provide a
     * `insertTextMode` property.
     *
     * @since 3.17.0
     */
    insertTextMode?: InsertTextMode;
}

/**
 * Describes the content type that a client supports in various
 * result literals like `Hover`, `ParameterInfo` or `CompletionItem`.
 *
 * Please note that `MarkupKinds` must not start with a `$`. This kinds
 * are reserved for internal usage.
 */
export type MarkupKind = 'plaintext' | 'markdown';

export type CompletionItemTag = 1;

export type InsertTextMode = 1 | 2;

/**
 * The kind of a completion entry.
 */
export enum CompletionItemKind {
    Text = 1,
    Method = 2,
    Function = 3,
    Constructor = 4,
    Field = 5,
    Variable = 6,
    Class = 7,
    Interface = 8,
    Module = 9,
    Property = 10,
    Unit = 11,
    Value = 12,
    Enum = 13,
    Keyword = 14,
    Snippet = 15,
    Color = 16,
    File = 17,
    Reference = 18,
    Folder = 19,
    EnumMember = 20,
    Constant = 21,
    Struct = 22,
    Event = 23,
    Operator = 24,
    TypeParameter = 25,
}

export interface HoverClientCapabilities {
    /**
     * Whether hover supports dynamic registration.
     */
    dynamicRegistration?: boolean;

    /**
     * Client supports the follow content formats if the content
     * property refers to a `literal of type MarkupContent`.
     * The order describes the preferred format of the client.
     */
    contentFormat?: MarkupKind[];
}

export interface SignatureHelpClientCapabilities {
    /**
     * Whether signature help supports dynamic registration.
     */
    dynamicRegistration?: boolean;

    /**
     * The client supports the following `SignatureInformation`
     * specific properties.
     */
    signatureInformation?: {
        /**
         * Client supports the follow content formats for the documentation
         * property. The order describes the preferred format of the client.
         */
        documentationFormat?: MarkupKind[];

        /**
         * Client capabilities specific to parameter information.
         */
        parameterInformation?: {
            /**
             * The client supports processing label offsets instead of a
             * simple label string.
             *
             * @since 3.14.0
             */
            labelOffsetSupport?: boolean;
        };

        /**
         * The client supports the `activeParameter` property on
         * `SignatureInformation` literal.
         *
         * @since 3.16.0
         */
        activeParameterSupport?: boolean;
    };

    /**
     * The client supports to send additional context information for a
     * `textDocument/signatureHelp` request. A client that opts into
     * contextSupport will also support the `retriggerCharacters` on
     * `SignatureHelpOptions`.
     *
     * @since 3.15.0
     */
    contextSupport?: boolean;
}

export interface DeclarationClientCapabilities {
    /**
     * Whether declaration supports dynamic registration. If this is set to
     * `true` the client supports the new `DeclarationRegistrationOptions`
     * return value for the corresponding server capability as well.
     */
    dynamicRegistration?: boolean;

    /**
     * The client supports additional metadata in the form of declaration links.
     */
    linkSupport?: boolean;
}

export interface DefinitionClientCapabilities {
    /**
     * Whether definition supports dynamic registration.
     */
    dynamicRegistration?: boolean;

    /**
     * The client supports additional metadata in the form of definition links.
     *
     * @since 3.14.0
     */
    linkSupport?: boolean;
}

export interface TypeDefinitionClientCapabilities {
    /**
     * Whether implementation supports dynamic registration. If this is set to
     * `true` the client supports the new `TypeDefinitionRegistrationOptions`
     * return value for the corresponding server capability as well.
     */
    dynamicRegistration?: boolean;

    /**
     * The client supports additional metadata in the form of definition links.
     *
     * @since 3.14.0
     */
    linkSupport?: boolean;
}

export interface ImplementationClientCapabilities {
    /**
     * Whether implementation supports dynamic registration. If this is set to
     * `true` the client supports the new `ImplementationRegistrationOptions`
     * return value for the corresponding server capability as well.
     */
    dynamicRegistration?: boolean;

    /**
     * The client supports additional metadata in the form of definition links.
     *
     * @since 3.14.0
     */
    linkSupport?: boolean;
}

export interface ReferenceClientCapabilities {
    /**
     * Whether references supports dynamic registration.
     */
    dynamicRegistration?: boolean;
}

export interface DocumentHighlightClientCapabilities {
    /**
     * Whether document highlight supports dynamic registration.
     */
    dynamicRegistration?: boolean;
}

export interface DocumentSymbolClientCapabilities {
    /**
     * Whether document symbol supports dynamic registration.
     */
    dynamicRegistration?: boolean;

    /**
     * Specific capabilities for the `SymbolKind` in the
     * `textDocument/documentSymbol` request.
     */
    symbolKind?: {
        /**
         * The symbol kind values the client supports. When this
         * property exists the client also guarantees that it will
         * handle values outside its set gracefully and falls back
         * to a default value when unknown.
         *
         * If this property is not present the client only supports
         * the symbol kinds from `File` to `Array` as defined in
         * the initial version of the protocol.
         */
        valueSet?: SymbolKind[];
    };

    /**
     * The client supports hierarchical document symbols.
     */
    hierarchicalDocumentSymbolSupport?: boolean;

    /**
     * The client supports tags on `SymbolInformation`. Tags are supported on
     * `DocumentSymbol` if `hierarchicalDocumentSymbolSupport` is set to true.
     * Clients supporting tags have to handle unknown tags gracefully.
     *
     * @since 3.16.0
     */
    tagSupport?: {
        /**
         * The tags supported by the client.
         */
        valueSet: SymbolTag[];
    };

    /**
     * The client supports an additional label presented in the UI when
     * registering a document symbol provider.
     *
     * @since 3.16.0
     */
    labelSupport?: boolean;
}

export interface CodeActionClientCapabilities {
    /**
     * Whether code action supports dynamic registration.
     */
    dynamicRegistration?: boolean;

    /**
     * The client supports code action literals as a valid
     * response of the `textDocument/codeAction` request.
     *
     * @since 3.8.0
     */
    codeActionLiteralSupport?: {
        /**
         * The code action kind is supported with the following value
         * set.
         */
        codeActionKind: {

            /**
             * The code action kind values the client supports. When this
             * property exists the client also guarantees that it will
             * handle values outside its set gracefully and falls back
             * to a default value when unknown.
             */
            valueSet: CodeActionKind[];
        };
    };

    /**
     * Whether code action supports the `isPreferred` property.
     *
     * @since 3.15.0
     */
    isPreferredSupport?: boolean;

    /**
     * Whether code action supports the `disabled` property.
     *
     * @since 3.16.0
     */
    disabledSupport?: boolean;

    /**
     * Whether code action supports the `data` property which is
     * preserved between a `textDocument/codeAction` and a
     * `codeAction/resolve` request.
     *
     * @since 3.16.0
     */
    dataSupport?: boolean;


    /**
     * Whether the client supports resolving additional code action
     * properties via a separate `codeAction/resolve` request.
     *
     * @since 3.16.0
     */
    resolveSupport?: {
        /**
         * The properties that a client can resolve lazily.
         */
        properties: string[];
    };

    /**
     * Whether th client honors the change annotations in
     * text edits and resource operations returned via the
     * `CodeAction#edit` property by for example presenting
     * the workspace edit in the user interface and asking
     * for confirmation.
     *
     * @since 3.16.0
     */
    honorsChangeAnnotations?: boolean;
}

/**
 * A set of predefined code action kinds.
 */
export enum CodeActionKind {

    /**
     * Empty kind.
     */
    Empty = '',

    /**
     * Base kind for quickfix actions: 'quickfix'.
     */
    QuickFix = 'quickfix',

    /**
     * Base kind for refactoring actions: 'refactor'.
     */
    Refactor = 'refactor',

    /**
     * Base kind for refactoring extraction actions: 'refactor.extract'.
     *
     * Example extract actions:
     *
     * - Extract method
     * - Extract function
     * - Extract variable
     * - Extract interface from class
     * - ...
     */
    RefactorExtract = 'refactor.extract',

    /**
     * Base kind for refactoring inline actions: 'refactor.inline'.
     *
     * Example inline actions:
     *
     * - Inline function
     * - Inline variable
     * - Inline constant
     * - ...
     */
    RefactorInline = 'refactor.inline',

    /**
     * Base kind for refactoring rewrite actions: 'refactor.rewrite'.
     *
     * Example rewrite actions:
     *
     * - Convert JavaScript function to class
     * - Add or remove parameter
     * - Encapsulate field
     * - Make method static
     * - Move method to base class
     * - ...
     */
    RefactorRewrite = 'refactor.rewrite',

    /**
     * Base kind for source actions: `source`.
     *
     * Source code actions apply to the entire file.
     */
    Source = 'source',

    /**
     * Base kind for an organize imports source action:
     * `source.organizeImports`.
     */
    SourceOrganizeImports =
    'source.organizeImports',
}

export interface CodeLensClientCapabilities {
    /**
     * Whether code lens supports dynamic registration.
     */
    dynamicRegistration?: boolean;
}

export interface DocumentLinkClientCapabilities {
    /**
     * Whether document link supports dynamic registration.
     */
    dynamicRegistration?: boolean;

    /**
     * Whether the client supports the `tooltip` property on `DocumentLink`.
     *
     * @since 3.15.0
     */
    tooltipSupport?: boolean;
}

export interface DocumentColorClientCapabilities {
    /**
     * Whether document color supports dynamic registration.
     */
    dynamicRegistration?: boolean;
}

export interface DocumentFormattingClientCapabilities {
    /**
     * Whether formatting supports dynamic registration.
     */
    dynamicRegistration?: boolean;
}

export interface DocumentRangeFormattingClientCapabilities {
    /**
     * Whether formatting supports dynamic registration.
     */
    dynamicRegistration?: boolean;
}

export interface DocumentOnTypeFormattingClientCapabilities {
    /**
     * Whether on type formatting supports dynamic registration.
     */
    dynamicRegistration?: boolean;
}

export type PrepareSupportDefaultBehavior = 1;

export interface RenameClientCapabilities {
    /**
     * Whether rename supports dynamic registration.
     */
    dynamicRegistration?: boolean;

    /**
     * Client supports testing for validity of rename operations
     * before execution.
     *
     * @since version 3.12.0
     */
    prepareSupport?: boolean;

    /**
     * Client supports the default behavior result
     * (`{ defaultBehavior: boolean }`).
     *
     * The value indicates the default behavior used by the
     * client.
     *
     * @since version 3.16.0
     */
    prepareSupportDefaultBehavior?: PrepareSupportDefaultBehavior;

    /**
     * Whether th client honors the change annotations in
     * text edits and resource operations returned via the
     * rename request's workspace edit by for example presenting
     * the workspace edit in the user interface and asking
     * for confirmation.
     *
     * @since 3.16.0
     */
    honorsChangeAnnotations?: boolean;
}

export interface PublishDiagnosticsClientCapabilities {
    /**
     * Whether the clients accepts diagnostics with related information.
     */
    relatedInformation?: boolean;

    /**
     * Client supports the tag property to provide meta data about a diagnostic.
     * Clients supporting tags have to handle unknown tags gracefully.
     *
     * @since 3.15.0
     */
    tagSupport?: {
        /**
         * The tags supported by the client.
         */
        valueSet: DiagnosticTag[];
    };

    /**
     * Whether the client interprets the version property of the
     * `textDocument/publishDiagnostics` notification's parameter.
     *
     * @since 3.15.0
     */
    versionSupport?: boolean;

    /**
     * Client supports a codeDescription property
     *
     * @since 3.16.0
     */
    codeDescriptionSupport?: boolean;

    /**
     * Whether code action supports the `data` property which is
     * preserved between a `textDocument/publishDiagnostics` and
     * `textDocument/codeAction` request.
     *
     * @since 3.16.0
     */
    dataSupport?: boolean;
}

export type DiagnosticTag = 1 | 2;

export interface FoldingRangeClientCapabilities {
    /**
     * Whether implementation supports dynamic registration for folding range
     * providers. If this is set to `true` the client supports the new
     * `FoldingRangeRegistrationOptions` return value for the corresponding
     * server capability as well.
     */
    dynamicRegistration?: boolean;
    /**
     * The maximum number of folding ranges that the client prefers to receive
     * per document. The value serves as a hint, servers are free to follow the
     * limit.
     */
    rangeLimit?: uinteger;
    /**
     * If set, the client signals that it only supports folding complete lines.
     * If set, client will ignore specified `startCharacter` and `endCharacter`
     * properties in a FoldingRange.
     */
    lineFoldingOnly?: boolean;
}

export interface SelectionRangeClientCapabilities {
    /**
     * Whether implementation supports dynamic registration for selection range
     * providers. If this is set to `true` the client supports the new
     * `SelectionRangeRegistrationOptions` return value for the corresponding
     * server capability as well.
     */
    dynamicRegistration?: boolean;
}

export interface LinkedEditingRangeClientCapabilities {
    /**
     * Whether implementation supports dynamic registration.
     * If this is set to `true` the client supports the new
     * `(TextDocumentRegistrationOptions & StaticRegistrationOptions)`
     * return value for the corresponding server capability as well.
     */
    dynamicRegistration?: boolean;
}

interface CallHierarchyClientCapabilities {
    /**
     * Whether implementation supports dynamic registration. If this is set to
     * `true` the client supports the new `(TextDocumentRegistrationOptions &
     * StaticRegistrationOptions)` return value for the corresponding server
     * capability as well.
     */
    dynamicRegistration?: boolean;
}

interface SemanticTokensClientCapabilities {
    /**
     * Whether implementation supports dynamic registration. If this is set to
     * `true` the client supports the new `(TextDocumentRegistrationOptions &
     * StaticRegistrationOptions)` return value for the corresponding server
     * capability as well.
     */
    dynamicRegistration?: boolean;

    /**
     * Which requests the client supports and might send to the server
     * depending on the server's capability. Please note that clients might not
     * show semantic tokens or degrade some of the user experience if a range
     * or full request is advertised by the client but not provided by the
     * server. If for example the client capability `requests.full` and
     * `request.range` are both set to true but the server only provides a
     * range provider the client might not render a minimap correctly or might
     * even decide to not show any semantic tokens at all.
     */
    requests: {
        /**
         * The client will send the `textDocument/semanticTokens/range` request
         * if the server provides a corresponding handler.
         */
        range?: boolean | object;

        /**
         * The client will send the `textDocument/semanticTokens/full` request
         * if the server provides a corresponding handler.
         */
        full?: boolean | {
            /**
             * The client will send the `textDocument/semanticTokens/full/delta`
             * request if the server provides a corresponding handler.
             */
            delta?: boolean;
        };
    };

    /**
     * The token types that the client supports.
     */
    tokenTypes: string[];

    /**
     * The token modifiers that the client supports.
     */
    tokenModifiers: string[];

    /**
     * The formats the clients supports.
     */
    formats: TokenFormat[];

    /**
     * Whether the client supports tokens that can overlap each other.
     */
    overlappingTokenSupport?: boolean;

    /**
     * Whether the client supports tokens that can span multiple lines.
     */
    multilineTokenSupport?: boolean;
}

export type TokenFormat = 'relative';

interface MonikerClientCapabilities {
    /**
     * Whether implementation supports dynamic registration. If this is set to
     * `true` the client supports the new `(TextDocumentRegistrationOptions &
     * StaticRegistrationOptions)` return value for the corresponding server
     * capability as well.
     */
    dynamicRegistration?: boolean;
}

/**
 * Show message request client capabilities
 */
export interface ShowMessageRequestClientCapabilities {
    /**
     * Capabilities specific to the `MessageActionItem` type.
     */
    messageActionItem?: {
        /**
         * Whether the client supports additional attributes which
         * are preserved and sent back to the server in the
         * request's response.
         */
        additionalPropertiesSupport?: boolean;
    };
}

/**
 * Client capabilities for the show document request.
 *
 * @since 3.16.0
 */
export interface ShowDocumentClientCapabilities {
    /**
     * The client has support for the show document
     * request.
     */
    support: boolean;
}

/**
 * Client capabilities specific to regular expressions.
 */
export interface RegularExpressionsClientCapabilities {
    /**
     * The engine's name.
     */
    engine: string;

    /**
     * The engine's version.
     */
    version?: string;
}

/**
 * Client capabilities specific to the used markdown parser.
 *
 * @since 3.16.0
 */
export interface MarkdownClientCapabilities {
    /**
     * The name of the parser.
     */
    parser: string;

    /**
     * The version of the parser.
     */
    version?: string;
}

export interface InitializeResult {
    /**
     * The capabilities the language server provides.
     */
    capabilities: ServerCapabilities;

    /**
     * Information about the server.
     *
     * @since 3.15.0
     */
    serverInfo?: {
        /**
         * The name of the server as defined by the server.
         */
        name: string;

        /**
         * The server's version as defined by the server.
         */
        version?: string;
    };
}

interface ServerCapabilities {
    /**
     * Defines how text documents are synced. Is either a detailed structure
     * defining each notification or for backwards compatibility the
     * TextDocumentSyncKind number. If omitted it defaults to
     * `TextDocumentSyncKind.None`.
     */
    textDocumentSync?: TextDocumentSyncOptions | TextDocumentSyncKind;

    /**
     * The server provides completion support.
     */
    completionProvider?: CompletionOptions;

    /**
     * The server provides hover support.
     */
    hoverProvider?: boolean | HoverOptions;

    /**
     * The server provides signature help support.
     */
    signatureHelpProvider?: SignatureHelpOptions;

    /**
     * The server provides go to declaration support.
     *
     * @since 3.14.0
     */
    declarationProvider?: boolean | DeclarationOptions
    | DeclarationRegistrationOptions;

    /**
     * The server provides goto definition support.
     */
    definitionProvider?: boolean | DefinitionOptions;

    /**
     * The server provides goto type definition support.
     *
     * @since 3.6.0
     */
    typeDefinitionProvider?: boolean | TypeDefinitionOptions
    | TypeDefinitionRegistrationOptions;

    /**
     * The server provides goto implementation support.
     *
     * @since 3.6.0
     */
    implementationProvider?: boolean | ImplementationOptions
    | ImplementationRegistrationOptions;

    /**
     * The server provides find references support.
     */
    referencesProvider?: boolean | ReferenceOptions;

    /**
     * The server provides document highlight support.
     */
    documentHighlightProvider?: boolean | DocumentHighlightOptions;

    /**
     * The server provides document symbol support.
     */
    documentSymbolProvider?: boolean | DocumentSymbolOptions;

    /**
     * The server provides code actions. The `CodeActionOptions` return type is
     * only valid if the client signals code action literal support via the
     * property `textDocument.codeAction.codeActionLiteralSupport`.
     */
    codeActionProvider?: boolean | CodeActionOptions;

    /**
     * The server provides code lens.
     */
    codeLensProvider?: CodeLensOptions;

    /**
     * The server provides document link support.
     */
    documentLinkProvider?: DocumentLinkOptions;

    /**
     * The server provides color provider support.
     *
     * @since 3.6.0
     */
    colorProvider?: boolean | DocumentColorOptions
    | DocumentColorRegistrationOptions;

    /**
     * The server provides document formatting.
     */
    documentFormattingProvider?: boolean | DocumentFormattingOptions;

    /**
     * The server provides document range formatting.
     */
    documentRangeFormattingProvider?: boolean | DocumentRangeFormattingOptions;

    /**
     * The server provides document formatting on typing.
     */
    documentOnTypeFormattingProvider?: DocumentOnTypeFormattingOptions;

    /**
     * The server provides rename support. RenameOptions may only be
     * specified if the client states that it supports
     * `prepareSupport` in its initial `initialize` request.
     */
    renameProvider?: boolean | RenameOptions;

    /**
     * The server provides folding provider support.
     *
     * @since 3.10.0
     */
    foldingRangeProvider?: boolean | FoldingRangeOptions
    | FoldingRangeRegistrationOptions;

    /**
     * The server provides execute command support.
     */
    executeCommandProvider?: ExecuteCommandOptions;

    /**
     * The server provides selection range support.
     *
     * @since 3.15.0
     */
    selectionRangeProvider?: boolean | SelectionRangeOptions
    | SelectionRangeRegistrationOptions;

    /**
     * The server provides linked editing range support.
     *
     * @since 3.16.0
     */
    linkedEditingRangeProvider?: boolean | LinkedEditingRangeOptions
    | LinkedEditingRangeRegistrationOptions;

    /**
     * The server provides call hierarchy support.
     *
     * @since 3.16.0
     */
    callHierarchyProvider?: boolean | CallHierarchyOptions
    | CallHierarchyRegistrationOptions;

    /**
     * The server provides semantic tokens support.
     *
     * @since 3.16.0
     */
    semanticTokensProvider?: SemanticTokensOptions
    | SemanticTokensRegistrationOptions;

    /**
     * Whether server provides moniker support.
     *
     * @since 3.16.0
     */
    monikerProvider?: boolean | MonikerOptions | MonikerRegistrationOptions;

    /**
     * The server provides workspace symbol support.
     */
    workspaceSymbolProvider?: boolean | WorkspaceSymbolOptions;

    /**
     * Workspace specific server capabilities
     */
    workspace?: {
        /**
         * The server supports workspace folder.
         *
         * @since 3.6.0
         */
        workspaceFolders?: WorkspaceFoldersServerCapabilities;

        /**
         * The server is interested in file notifications/requests.
         *
         * @since 3.16.0
         */
        fileOperations?: {
            /**
             * The server is interested in receiving didCreateFiles
             * notifications.
             */
            didCreate?: FileOperationRegistrationOptions;

            /**
             * The server is interested in receiving willCreateFiles requests.
             */
            willCreate?: FileOperationRegistrationOptions;

            /**
             * The server is interested in receiving didRenameFiles
             * notifications.
             */
            didRename?: FileOperationRegistrationOptions;

            /**
             * The server is interested in receiving willRenameFiles requests.
             */
            willRename?: FileOperationRegistrationOptions;

            /**
             * The server is interested in receiving didDeleteFiles file
             * notifications.
             */
            didDelete?: FileOperationRegistrationOptions;

            /**
             * The server is interested in receiving willDeleteFiles file
             * requests.
             */
            willDelete?: FileOperationRegistrationOptions;
        };
    };

    /**
     * Experimental server capabilities.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    experimental?: any;
}

export interface TextDocumentSyncOptions {
    /**
     * Open and close notifications are sent to the server. If omitted open
     * close notification should not be sent.
     */
    openClose?: boolean;

    /**
     * Change notifications are sent to the server. See
     * TextDocumentSyncKind.None, TextDocumentSyncKind.Full and
     * TextDocumentSyncKind.Incremental. If omitted it defaults to
     * TextDocumentSyncKind.None.
     */
    change?: TextDocumentSyncKind;
}

/**
 * Defines how the host (editor) should sync document changes to the language
 * server.
 */
export enum TextDocumentSyncKind {
    /**
     * Documents should not be synced at all.
     */
    None = 0,

    /**
     * Documents are synced by always sending the full content
     * of the document.
     */
    Full = 1,

    /**
     * Documents are synced by sending the full content on open.
     * After that only incremental updates to the document are
     * send.
     */
    Incremental = 2
}

/**
 * Completion options.
 */
export interface CompletionOptions extends WorkDoneProgressOptions {
    /**
     * Most tools trigger completion request automatically without explicitly
     * requesting it using a keyboard shortcut (e.g. Ctrl+Space). Typically they
     * do so when the user starts to type an identifier. For example if the user
     * types `c` in a JavaScript file code complete will automatically pop up
     * present `console` besides others as a completion item. Characters that
     * make up identifiers don't need to be listed here.
     *
     * If code complete should automatically be trigger on characters not being
     * valid inside an identifier (for example `.` in JavaScript) list them in
     * `triggerCharacters`.
     */
    triggerCharacters?: string[];

    /**
     * The list of all possible characters that commit a completion. This field
     * can be used if clients don't support individual commit characters per
     * completion item. See client capability
     * `completion.completionItem.commitCharactersSupport`.
     *
     * If a server provides both `allCommitCharacters` and commit characters on
     * an individual completion item the ones on the completion item win.
     *
     * @since 3.2.0
     */
    allCommitCharacters?: string[];

    /**
     * The server provides support to resolve additional
     * information for a completion item.
     */
    resolveProvider?: boolean;

    /**
     * The server supports the following `CompletionItem` specific
     * capabilities.
     *
     * @since 3.17.0 - proposed state
     */
    completionItem?: {
        /**
         * The server has support for completion item label
         * details (see also `CompletionItemLabelDetails`) when receiving
         * a completion item in a resolve call.
         *
         * @since 3.17.0 - proposed state
         */
        labelDetailsSupport?: boolean;
    }
}

export interface WorkDoneProgressOptions {
    workDoneProgress?: boolean;
}

export type HoverOptions = WorkDoneProgressOptions

export interface SignatureHelpOptions extends WorkDoneProgressOptions {
    /**
     * The characters that trigger signature help
     * automatically.
     */
    triggerCharacters?: string[];

    /**
     * List of characters that re-trigger signature help.
     *
     * These trigger characters are only active when signature help is already
     * showing. All trigger characters are also counted as re-trigger
     * characters.
     *
     * @since 3.15.0
     */
    retriggerCharacters?: string[];
}

export type DeclarationOptions = WorkDoneProgressOptions

export interface DeclarationRegistrationOptions extends DeclarationOptions,
    TextDocumentRegistrationOptions, StaticRegistrationOptions {
}

/**
 * General text document registration options.
 */
export interface TextDocumentRegistrationOptions {
    /**
     * A document selector to identify the scope of the registration. If set to
     * null the document selector provided on the client side will be used.
     */
    documentSelector: DocumentSelector | null;
}

export type DocumentSelector = DocumentFilter[];

export interface DocumentFilter {
    /**
     * A language id, like `typescript`.
     */
    language?: string;

    /**
     * A Uri [scheme](#Uri.scheme), like `file` or `untitled`.
     */
    scheme?: string;

    /**
     * A glob pattern, like `*.{ts,js}`.
     *
     * Glob patterns can have the following syntax:
     * - `*` to match one or more characters in a path segment
     * - `?` to match on one character in a path segment
     * - `**` to match any number of path segments, including none
     * - `{}` to group sub patterns into an OR expression. (e.g. `** /*.{ts,js}`
     *   matches all TypeScript and JavaScript files)
     * - `[]` to declare a range of characters to match in a path segment
     *   (e.g., `example.[0-9]` to match on `example.0`, `example.1`, …)
     * - `[!...]` to negate a range of characters to match in a path segment
     *   (e.g., `example.[!0-9]` to match on `example.a`, `example.b`, but
     *   not `example.0`)
     */
    pattern?: string;
}

/**
 * Static registration options to be returned in the initialize request.
 */
export interface StaticRegistrationOptions {
    /**
     * The id used to register the request. The id can be used to deregister
     * the request again. See also Registration#id.
     */
    id?: string;
}

export interface TypeDefinitionRegistrationOptions extends
    TextDocumentRegistrationOptions, TypeDefinitionOptions,
    StaticRegistrationOptions {
}

export type DefinitionOptions = WorkDoneProgressOptions

export type TypeDefinitionOptions = WorkDoneProgressOptions

export type ImplementationOptions = WorkDoneProgressOptions

export interface ImplementationRegistrationOptions extends
    TextDocumentRegistrationOptions, ImplementationOptions,
    StaticRegistrationOptions {
}

export type ReferenceOptions = WorkDoneProgressOptions

export type DocumentHighlightOptions = WorkDoneProgressOptions

export interface DocumentSymbolOptions extends WorkDoneProgressOptions {
    /**
     * A human-readable string that is shown when multiple outlines trees
     * are shown for the same document.
     *
     * @since 3.16.0
     */
    label?: string;
}

export interface CodeActionOptions extends WorkDoneProgressOptions {
    /**
     * CodeActionKinds that this server may return.
     *
     * The list of kinds may be generic, such as `CodeActionKind.Refactor`,
     * or the server may list out every specific kind they provide.
     */
    codeActionKinds?: CodeActionKind[];

    /**
     * The server provides support to resolve additional
     * information for a code action.
     *
     * @since 3.16.0
     */
    resolveProvider?: boolean;
}

export interface CodeLensOptions extends WorkDoneProgressOptions {
    /**
     * Code lens has a resolve provider as well.
     */
    resolveProvider?: boolean;
}

export interface DocumentLinkOptions extends WorkDoneProgressOptions {
    /**
     * Document links have a resolve provider as well.
     */
    resolveProvider?: boolean;
}

export type DocumentColorOptions = WorkDoneProgressOptions

export interface DocumentColorRegistrationOptions extends
    TextDocumentRegistrationOptions, StaticRegistrationOptions,
    DocumentColorOptions {
}

export type DocumentFormattingOptions = WorkDoneProgressOptions

export type DocumentRangeFormattingOptions = WorkDoneProgressOptions

export interface DocumentOnTypeFormattingOptions {
    /**
     * A character on which formatting should be triggered, like `}`.
     */
    firstTriggerCharacter: string;

    /**
     * More trigger characters.
     */
    moreTriggerCharacter?: string[];
}

export interface RenameOptions extends WorkDoneProgressOptions {
    /**
     * Renames should be checked and tested before being executed.
     */
    prepareProvider?: boolean;
}

export type FoldingRangeOptions = WorkDoneProgressOptions

export interface FoldingRangeRegistrationOptions extends
    TextDocumentRegistrationOptions, FoldingRangeOptions,
    StaticRegistrationOptions {
}

export interface ExecuteCommandOptions extends WorkDoneProgressOptions {
    /**
     * The commands to be executed on the server
     */
    commands: string[];
}

export type SelectionRangeOptions = WorkDoneProgressOptions

export interface SelectionRangeRegistrationOptions extends
    SelectionRangeOptions, TextDocumentRegistrationOptions,
    StaticRegistrationOptions {
}

export type LinkedEditingRangeOptions = WorkDoneProgressOptions

export interface LinkedEditingRangeRegistrationOptions extends
    TextDocumentRegistrationOptions, LinkedEditingRangeOptions,
    StaticRegistrationOptions {
}

export type CallHierarchyOptions = WorkDoneProgressOptions

export interface CallHierarchyRegistrationOptions extends
    TextDocumentRegistrationOptions, CallHierarchyOptions,
    StaticRegistrationOptions {
}

export interface SemanticTokensOptions extends WorkDoneProgressOptions {
    /**
     * The legend used by the server
     */
    legend: SemanticTokensLegend;

    /**
     * Server supports providing semantic tokens for a specific range
     * of a document.
     */
    range?: boolean | object;

    /**
     * Server supports providing semantic tokens for a full document.
     */
    full?: boolean | {
        /**
         * The server supports deltas for full documents.
         */
        delta?: boolean;
    };
}

export interface SemanticTokensLegend {
    /**
     * The token types a server uses.
     */
    tokenTypes: string[];

    /**
     * The token modifiers a server uses.
     */
    tokenModifiers: string[];
}

export interface SemanticTokensRegistrationOptions extends
    TextDocumentRegistrationOptions, SemanticTokensOptions,
    StaticRegistrationOptions {
}

export type MonikerOptions = WorkDoneProgressOptions

export interface MonikerRegistrationOptions extends
    TextDocumentRegistrationOptions, MonikerOptions {
}

export type WorkspaceSymbolOptions = WorkDoneProgressOptions

export interface WorkspaceFoldersServerCapabilities {
    /**
     * The server has support for workspace folders
     */
    supported?: boolean;

    /**
     * Whether the server wants to receive workspace folder
     * change notifications.
     *
     * If a string is provided, the string is treated as an ID
     * under which the notification is registered on the client
     * side. The ID can be used to unregister for these events
     * using the `client/unregisterCapability` request.
     */
    changeNotifications?: string | boolean;
}

/**
 * The options to register for file operations.
 *
 * @since 3.16.0
 */
interface FileOperationRegistrationOptions {
    /**
     * The actual filters.
     */
    filters: FileOperationFilter[];
}

/**
 * A filter to describe in which file operation requests or notifications
 * the server is interested in.
 *
 * @since 3.16.0
 */
export interface FileOperationFilter {

    /**
     * A Uri like `file` or `untitled`.
     */
    scheme?: string;

    /**
     * The actual file operation pattern.
     */
    pattern: FileOperationPattern;
}

/**
 * A pattern to describe in which file operation requests or notifications
 * the server is interested in.
 *
 * @since 3.16.0
 */
interface FileOperationPattern {
    /**
     * The glob pattern to match. Glob patterns can have the following syntax:
     * - `*` to match one or more characters in a path segment
     * - `?` to match on one character in a path segment
     * - `**` to match any number of path segments, including none
     * - `{}` to group sub patterns into an OR expression. (e.g. `** /*.{ts,js}`
     *   matches all TypeScript and JavaScript files)
     * - `[]` to declare a range of characters to match in a path segment
     *   (e.g., `example.[0-9]` to match on `example.0`, `example.1`, …)
     * - `[!...]` to negate a range of characters to match in a path segment
     *   (e.g., `example.[!0-9]` to match on `example.a`, `example.b`, but
     *   not `example.0`)
     */
    glob: string;

    /**
     * Whether to match files or folders with this pattern.
     *
     * Matches both if undefined.
     */
    matches?: FileOperationPatternKind;

    /**
     * Additional options used during matching.
     */
    options?: FileOperationPatternOptions;
}

export type FileOperationPatternKind = 'file' | 'folder';

/**
 * Matching options for the file operation pattern.
 *
 * @since 3.16.0
 */
export interface FileOperationPatternOptions {

    /**
     * The pattern should be matched ignoring casing.
     */
    ignoreCase?: boolean;
}

export interface ShutdownResult {
    result: null;
    error?: ResponseError
}

export interface DidOpenTextDocumentParams {
    /**
     * The document that was opened.
     */
    textDocument: TextDocumentItem;
}

export interface TextDocumentItem {
    /**
     * The text document's URI.
     */
    uri: DocumentUri;

    /**
     * The text document's language identifier.
     */
    languageId: string;

    /**
     * The version number of this document (it will increase after each
     * change, including undo/redo).
     */
    version: integer;

    /**
     * The content of the opened text document.
     */
    text: string;
}

export interface DocumentSymbolParams extends WorkDoneProgressParams,
    PartialResultParams {
    /**
     * The text document.
     */
    textDocument: TextDocumentIdentifier;
}

export interface PartialResultParams {
    /**
     * An optional token that a server can use to report partial results (e.g.
     * streaming) to the client.
     */
    partialResultToken?: ProgressToken;
}


/**
 * Represents programming constructs like variables, classes, interfaces etc.
 * that appear in a document. Document symbols can be hierarchical and they
 * have two ranges: one that encloses its definition and one that points to its
 * most interesting range, e.g. the range of an identifier.
 */
export interface DocumentSymbol {

    /**
     * The name of this symbol. Will be displayed in the user interface and
     * therefore must not be an empty string or a string only consisting of
     * white spaces.
     */
    name: string;

    /**
     * More detail for this symbol, e.g the signature of a function.
     */
    detail?: string;

    /**
     * The kind of this symbol.
     */
    kind: SymbolKind;

    /**
     * Tags for this document symbol.
     *
     * @since 3.16.0
     */
    tags?: SymbolTag[];

    /**
     * Indicates if this symbol is deprecated.
     *
     * @deprecated Use tags instead
     */
    deprecated?: boolean;

    /**
     * The range enclosing this symbol not including leading/trailing whitespace
     * but everything else like comments. This information is typically used to
     * determine if the clients cursor is inside the symbol to reveal in the
     * symbol in the UI.
     */
    range: Range;

    /**
     * The range that should be selected and revealed when this symbol is being
     * picked, e.g. the name of a function. Must be contained by the `range`.
     */
    selectionRange: Range;

    /**
     * Children of this symbol, e.g. properties of a class.
     */
    children?: DocumentSymbol[];
}

/**
 * Represents information about programming constructs like variables, classes,
 * interfaces etc.
 */
export interface SymbolInformation {
    /**
     * The name of this symbol.
     */
    name: string;

    /**
     * The kind of this symbol.
     */
    kind: SymbolKind;

    /**
     * Tags for this symbol.
     *
     * @since 3.16.0
     */
    tags?: SymbolTag[];

    /**
     * Indicates if this symbol is deprecated.
     *
     * @deprecated Use tags instead
     */
    deprecated?: boolean;

    /**
     * The location of this symbol. The location's range is used by a tool
     * to reveal the location in the editor. If the symbol is selected in the
     * tool the range's start information is used to position the cursor. So
     * the range usually spans more then the actual symbol's name and does
     * normally include things like visibility modifiers.
     *
     * The range doesn't have to denote a node range in the sense of a abstract
     * syntax tree. It can therefore not be used to re-construct a hierarchy of
     * the symbols.
     */
    location: Location;

    /**
     * The name of the symbol containing this symbol. This information is for
     * user interface purposes (e.g. to render a qualifier in the user interface
     * if necessary). It can't be used to re-infer a hierarchy for the document
     * symbols.
     */
    containerName?: string;
}

export interface Location {
    uri: DocumentUri;
    range: Range;
}


export interface ReferenceParams extends TextDocumentPositionParams,
    WorkDoneProgressParams, PartialResultParams {
    context: ReferenceContext;
}

interface TextDocumentPositionParams {
    /**
     * The text document.
     */
    textDocument: TextDocumentIdentifier;

    /**
     * The position inside the text document.
     */
    position: Position;
}

export interface ReferenceContext {
    /**
     * Include the declaration of the current symbol.
     */
    includeDeclaration: boolean;
}

export interface DidCloseTextDocumentParams {
    /**
     * The document that was closed.
     */
    textDocument: TextDocumentIdentifier;
}

export interface DefinitionParams extends TextDocumentPositionParams,
    WorkDoneProgressParams, PartialResultParams {
}

export interface LocationLink {

    /**
     * Span of the origin of this link.
     *
     * Used as the underlined span for mouse interaction. Defaults to the word
     * range at the mouse position.
     */
    originSelectionRange?: Range;

    /**
     * The target resource identifier of this link.
     */
    targetUri: DocumentUri;

    /**
     * The full target range of this link. If the target for example is a symbol
     * then target range is the range enclosing this symbol not including
     * leading/trailing whitespace but everything else like comments. This
     * information is typically used to highlight the range in the editor.
     */
    targetRange: Range;

    /**
     * The range that should be selected and revealed when this link is being
     * followed, e.g the name of a function. Must be contained by the the
     * `targetRange`. See also `DocumentSymbol#range`
     */
    targetSelectionRange: Range;
}

export interface TypeDefinitionParams extends TextDocumentPositionParams,
    WorkDoneProgressParams, PartialResultParams {
}

export interface SignatureHelpParams extends TextDocumentPositionParams,
    WorkDoneProgressParams {
    /**
     * The signature help context. This is only available if the client
     * specifies to send this using the client capability
     * `textDocument.signatureHelp.contextSupport === true`
     *
     * @since 3.15.0
     */
    context?: SignatureHelpContext;
}

/**
 * Additional information about the context in which a signature help request
 * was triggered.
 *
 * @since 3.15.0
 */
export interface SignatureHelpContext {
    /**
     * Action that caused signature help to be triggered.
     */
    triggerKind: SignatureHelpTriggerKind;

    /**
     * Character that caused signature help to be triggered.
     *
     * This is undefined when triggerKind !==
     * SignatureHelpTriggerKind.TriggerCharacter
     */
    triggerCharacter?: string;

    /**
     * `true` if signature help was already showing when it was triggered.
     *
     * Retriggers occur when the signature help is already active and can be
     * caused by actions such as typing a trigger character, a cursor move, or
     * document content changes.
     */
    isRetrigger: boolean;

    /**
     * The currently active `SignatureHelp`.
     *
     * The `activeSignatureHelp` has its `SignatureHelp.activeSignature` field
     * updated based on the user navigating through available signatures.
     */
    activeSignatureHelp?: SignatureHelp;
}

/**
 * How a signature help was triggered.
 *
 * @since 3.15.0
 */
export enum SignatureHelpTriggerKind {
    /**
     * Signature help was invoked manually by the user or by a command.
     */
    Invoked = 1,
    /**
     * Signature help was triggered by a trigger character.
     */
    TriggerCharacter = 2,
    /**
     * Signature help was triggered by the cursor moving or by the document
     * content changing.
     */
    ContentChange = 3,
}

/**
 * Signature help represents the signature of something
 * callable. There can be multiple signature but only one
 * active and only one active parameter.
 */
export interface SignatureHelp {
    /**
     * One or more signatures. If no signatures are available the signature help
     * request should return `null`.
     */
    signatures: SignatureInformation[];

    /**
     * The active signature. If omitted or the value lies outside the
     * range of `signatures` the value defaults to zero or is ignore if
     * the `SignatureHelp` as no signatures.
     *
     * Whenever possible implementors should make an active decision about
     * the active signature and shouldn't rely on a default value.
     *
     * In future version of the protocol this property might become
     * mandatory to better express this.
     */
    activeSignature?: uinteger;

    /**
     * The active parameter of the active signature. If omitted or the value
     * lies outside the range of `signatures[activeSignature].parameters`
     * defaults to 0 if the active signature has parameters. If
     * the active signature has no parameters it is ignored.
     * In future version of the protocol this property might become
     * mandatory to better express the active parameter if the
     * active signature does have any.
     */
    activeParameter?: uinteger;
}

/**
 * Represents the signature of something callable. A signature
 * can have a label, like a function-name, a doc-comment, and
 * a set of parameters.
 */
export interface SignatureInformation {
    /**
     * The label of this signature. Will be shown in
     * the UI.
     */
    label: string;

    /**
     * The human-readable doc-comment of this signature. Will be shown
     * in the UI but can be omitted.
     */
    documentation?: string | MarkupContent;

    /**
     * The parameters of this signature.
     */
    parameters?: ParameterInformation[];

    /**
     * The index of the active parameter.
     *
     * If provided, this is used in place of `SignatureHelp.activeParameter`.
     *
     * @since 3.16.0
     */
    activeParameter?: uinteger;
}

/**
 * A `MarkupContent` literal represents a string value which content is
 * interpreted base on its kind flag. Currently the protocol supports
 * `plaintext` and `markdown` as markup kinds.
 *
 * If the kind is `markdown` then the value can contain fenced code blocks like
 * in GitHub issues.
 *
 * Here is an example how such a string can be constructed using
 * JavaScript / TypeScript:
 * ```typescript
 * let markdown: MarkdownContent = {
 * 	kind: MarkupKind.Markdown,
 * 	value: [
 * 		'# Header',
 * 		'Some text',
 * 		'```typescript',
 * 		'someCode();',
 * 		'```'
 * 	].join('\n')
 * };
 * ```
 *
 * *Please Note* that clients might sanitize the return markdown. A client could
 * decide to remove HTML from the markdown to avoid script execution.
 */
export interface MarkupContent {
    /**
     * The type of the Markup
     */
    kind: MarkupKind;

    /**
     * The content itself
     */
    value: string;
}

/**
 * Represents a parameter of a callable-signature. A parameter can
 * have a label and a doc-comment.
 */
export interface ParameterInformation {

    /**
     * The label of this parameter information.
     *
     * Either a string or an inclusive start and exclusive end offsets within
     * its containing signature label. (see SignatureInformation.label). The
     * offsets are based on a UTF-16 string representation as `Position` and
     * `Range` does.
     *
     * *Note*: a label of type string should be a substring of its containing
     * signature label. Its intended use case is to highlight the parameter
     * label part in the `SignatureInformation.label`.
     */
    label: string | [uinteger, uinteger];

    /**
     * The human-readable doc-comment of this parameter. Will be shown
     * in the UI but can be omitted.
     */
    documentation?: string | MarkupContent;
}

export interface HoverParams extends TextDocumentPositionParams,
  WorkDoneProgressParams {
}

/**
 * MarkedString can be used to render human readable text. It is either a
 * markdown string or a code-block that provides a language and a code snippet.
 * The language identifier is semantically equal to the optional language
 * identifier in fenced code blocks in GitHub issues.
 *
 * The pair of a language and a value is an equivalent to markdown:
 * ```${language}
 * ${value}
 * ```
 *
 * Note that markdown strings will be sanitized - that means html will be
 * escaped.
 *
 * @deprecated use MarkupContent instead.
 */
type MarkedString = string | { language: string; value: string };

/**
 * A `MarkupContent` literal represents a string value which content is
 * interpreted base on its kind flag. Currently the protocol supports
 * `plaintext` and `markdown` as markup kinds.
 *
 * If the kind is `markdown` then the value can contain fenced code blocks like
 * in GitHub issues.
 *
 * Here is an example how such a string can be constructed using
 * JavaScript / TypeScript:
 * ```typescript
 * let markdown: MarkdownContent = {
 * 	kind: MarkupKind.Markdown,
 * 	value: [
 * 		'# Header',
 * 		'Some text',
 * 		'```typescript',
 * 		'someCode();',
 * 		'```'
 * 	].join('\n')
 * };
 * ```
 *
 * *Please Note* that clients might sanitize the return markdown. A client could
 * decide to remove HTML from the markdown to avoid script execution.
 */
export interface MarkupContent {
  /**
   * The type of the Markup
   */
  kind: MarkupKind;

  /**
   * The content itself
   */
  value: string;
}

/**
 * The result of a hover request.
 */
export interface Hover {
  /**
   * The hover's content
   */
  contents: MarkedString | MarkedString[] | MarkupContent;

  /**
   * An optional range is a range inside a text document
   * that is used to visualize a hover, e.g. by changing the background color.
   */
  range?: Range;
}

export interface DeclarationParams extends TextDocumentPositionParams,
  WorkDoneProgressParams, PartialResultParams {
}


