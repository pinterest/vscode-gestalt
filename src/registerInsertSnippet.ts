import * as vscode from "vscode";
import log from "./log";
import track from "./track";
import addImport from "./addImport";

async function insertSnippet({
  component,
  charactersSaved,
  location,
}: {
  component: string;
  charactersSaved?: number;
  location: "quickPick" | "inline";
}) {
  // auto import
  const document = vscode.window.activeTextEditor!.document;

  const allTextRange = new vscode.Range(
    document.positionAt(0),
    document.positionAt(document.getText().length)
  );
  const allText = document.getText(allTextRange);

  const lastImportLine = allText
    .split("\n")
    .reduce((acc, currentValue, currentIndex) => {
      if (currentValue.startsWith("import ")) {
        acc = currentIndex;
      }
      return acc;
    }, 0);

  const untilLastImportRange = new vscode.Range(
    document.positionAt(0),
    document.lineAt(lastImportLine).range.end
  );

  const untilLastImport = document.getText(untilLastImportRange);

  log.append(`untilLastImport\n\n${untilLastImport}`);

  let transformedCode = "";

  try {
    transformedCode = await addImport({
      code: untilLastImport,
      componentName: component,
    });
  } catch (error) {
    console.log(error);
  }

  vscode.window.activeTextEditor?.edit((builder) =>
    builder.replace(untilLastImportRange, transformedCode)
  );
  // await vscode.commands.executeCommand("editor.action.formatDocument");
  log.append(`transformed Code \n\n${transformedCode}`);

  // log.append(`allText: ${allText}`);

  track.event({
    category: "Event",
    action: "Count",
    label: "InsertSnippet",
    value: String(1),
  });
  track.event({
    category: "Event",
    action: "Count",
    label: "InsertSnippetComponent",
    value: component,
  });
  track.event({
    category: "Event",
    action: "Count",
    label: "InsertSnippetLocation",
    value: location,
  });
  track.event({
    category: "Event",
    action: "Count",
    label: "InsertSnippetCharactersSaved",
    value: String(charactersSaved),
  });
}

export default function registerInsertSnippet() {
  vscode.commands.registerCommand("gestalt.track.insertSnippet", insertSnippet);
}
