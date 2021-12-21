import {
  languages,
  DocumentSelector,
  Disposable,
  ExtensionContext,
  window,
} from "vscode";
import ComponentsTreeDataProvider from "./ComponentsTreeDataProvider";
import HelpTreeDataProvider from "./HelpTreeDataProvider";
import log from "./log";
import registerInsertSnippet from "./registerInsertSnippet";
import registerInsertSnippetFromTreeView from "./registerInsertSnippetFromTreeView";
import registerOpenComponentUrl from "./registerOpenComponentUrl";
import registerOpenUrl from "./registerOpenUrl";
import registerQuickPickCommand from "./registerQuickPickCommand";
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
    window.createTreeView("gestalt-view-components", {
      showCollapseAll: true,
      treeDataProvider: new ComponentsTreeDataProvider(),
    }),
    window.createTreeView("gestalt-view-help", {
      showCollapseAll: true,
      treeDataProvider: new HelpTreeDataProvider(),
    }),
  ];
  return Disposable.from(...subscriptions);
}

function registerCommands(): void {
  registerInsertSnippetFromTreeView();
  registerInsertSnippet();
  registerQuickPickCommand();
  registerOpenUrl();
  registerOpenComponentUrl();
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
