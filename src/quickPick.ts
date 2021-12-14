import vscode from "vscode";
import { ExtensionContext } from "vscode";
import log from "./log";
import removeMarkdown from "./removeMarkdown";
import { snippets } from "./snippets.json";

async function quickPick(context: ExtensionContext) {
  const items: vscode.QuickPickItem[] = snippets.map(
    ({ description, name }) => ({
      label: name,
      detail: removeMarkdown(description),
    })
  );
  const selectedItem = await vscode.window.showQuickPick(items, {
    placeHolder: "Insert a Gestalt component",
  });
  if (!selectedItem) {
    return;
  }

  const { label } = selectedItem;
  const snippet = snippets.find(({ name }) => name === label);

  if (!snippet) {
    return;
  }

  const codeToInsert = snippet.body.join("\n");

  await vscode.commands.executeCommand("editor.action.insertSnippet", {
    snippet: codeToInsert,
  });

  await vscode.commands.executeCommand("gestalt.track.insertSnippet", {
    component: snippet.name,
    charactersSaved: codeToInsert.length,
    location: "quickPick",
  });
}

export function registerCommand() {
  vscode.commands.registerCommand("gestalt.quickPick", quickPick);
}
