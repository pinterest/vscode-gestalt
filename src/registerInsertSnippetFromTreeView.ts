import * as vscode from "vscode";
import { snippets } from "./snippets.json";

async function insertSnippetFromTreeView({
  component,
}: {
  component: string;
}): Promise<void> {
  const snippet = snippets.find(({ name }) => name === component);
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
    location: "treeView",
  });
}

export default function registerInsertSnippetFromTreeView() {
  vscode.commands.registerCommand(
    "gestalt.insertSnippetFromTreeView",
    insertSnippetFromTreeView
  );
}
