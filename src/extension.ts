import {
  languages,
  DocumentSelector,
  Disposable,
  ExtensionContext,
} from "vscode";
import log from "./log";
import SnippetCompletionItemProvider from "./SnippetCompletionItemProvider";
import track from "./track";

const documentSelector: DocumentSelector = [
  "javascript",
  "javascriptreact",
  "jsx",
  "plaintext",
  "typescript",
  "typescriptreact",
];

const snippetCompletionProvider = new SnippetCompletionItemProvider();

function addProviders(): Disposable {
  const subscriptions: Disposable[] = [
    languages.registerCompletionItemProvider(
      documentSelector,
      snippetCompletionProvider,
      ...SnippetCompletionItemProvider.triggerCharacters
    ),
  ];
  return Disposable.from(...subscriptions);
}

function registerCommands(): void {
  snippetCompletionProvider.registerCommands();
}

export function activate(context: ExtensionContext) {
  log.append('Extension "vscode-gestalt" is now active!');

  track.event({
    category: "Event",
    action: "Activate",
    label: "Extension",
  });

  addProviders();
  registerCommands();
}

// this method is called when your extension is deactivated
export function deactivate() {}
