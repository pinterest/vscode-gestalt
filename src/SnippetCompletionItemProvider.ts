import log from "./log";
import track from "./track";

import {
  Command,
  commands,
  CompletionItem,
  CompletionItemKind,
  CompletionItemProvider,
  CompletionList,
  Position,
  Range,
  SnippetString,
  TextDocument,
  window,
} from "vscode";
import snippets from "./snippets.json";
import { MarkdownString } from "vscode";
import { SnippetParser } from "./snippetParser";
import addImport from "./ast/addImport";

class SnippetCompletionItem implements CompletionItem {
  kind?: CompletionItemKind;
  label: string;
  detail: string;
  insertText?: SnippetString;
  range: Range;
  documentation?: MarkdownString;
  command: Command;

  constructor({
    label,
    prefix,
    text,
    range,
    textBeforeCursorLength,
    snippetLength,
  }: {
    label: string;
    prefix: string;
    text: SnippetString;
    range: Range;
    textBeforeCursorLength: number;
    snippetLength: number;
  }) {
    this.label = prefix;
    this.insertText = text;
    this.range = range;
    this.detail = label;
    this.kind = CompletionItemKind.Snippet;
    this.command = {
      title: "track",
      command: "gestalt.track.insertSnippet",
      arguments: [
        {
          component: prefix.replace("<", ""),
          charactersSaved: snippetLength - textBeforeCursorLength,
        },
      ],
    };
  }

  resolve(): this {
    const text = new SnippetParser().text(this.insertText?.value ?? "");
    this.documentation = new MarkdownString().appendCodeblock(text);

    return this;
  }
}

class SnippetCompletionItemProvider
  implements CompletionItemProvider<CompletionItem>
{
  public static readonly triggerCharacters = ["<"];

  async resolveCompletionItem(
    item: SnippetCompletionItem
  ): Promise<SnippetCompletionItem | undefined> {
    return item instanceof SnippetCompletionItem ? item.resolve() : item;
  }

  public registerCommands() {
    commands.registerCommand(
      "gestalt.track.insertSnippet",
      async function trackSnippet({
        component,
        charactersSaved,
      }: {
        component: string;
        charactersSaved: number;
      }) {
        // auto import
        const document = window.activeTextEditor!.document;

        const allTextRange = new Range(
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

        const untilLastImportRange = new Range(
          document.positionAt(0),
          document.lineAt(lastImportLine).range.end
        );

        const untilLastImport = document.getText(untilLastImportRange);

        log.append(`untilLastImport\n${untilLastImport}`);
        log.append(`Last import line ${lastImportLine}`);

        const transformedCode = await addImport({
          code: untilLastImport,
          componentName: component,
        });

        window.activeTextEditor?.edit((builder) =>
          builder.replace(untilLastImportRange, transformedCode)
        );
        await commands.executeCommand("editor.action.formatDocument");
        log.append("transformed Code");

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
          label: "InsertSnippetCharactersSaved",
          value: String(charactersSaved),
        });
      }
    );
  }

  public async provideCompletionItems(
    document: TextDocument,
    position: Position
  ): Promise<CompletionList<CompletionItem> | undefined> {
    log.append("provideCompletionItems");

    const textBeforeCursor = document
      .getText(document.lineAt(position.line).range)
      .trim();

    if (!textBeforeCursor) {
      return undefined;
    }

    log.append(`textBeforeCursor: ${textBeforeCursor}`);

    return new CompletionList(
      Object.entries(snippets)
        .filter(([_, { prefix }]) => {
          return prefix
            .toLocaleLowerCase()
            .startsWith(textBeforeCursor.toLocaleLowerCase());
        })
        .map(([label, { prefix, body }]) => {
          const text = body.join("\n");
          const completionItem = new SnippetCompletionItem({
            label,
            prefix,
            range: new Range(
              position.translate(0, -textBeforeCursor.length),
              position
            ),
            text: new SnippetString(text),
            textBeforeCursorLength: textBeforeCursor.length,
            snippetLength: text.length,
          });

          log.append(`label: ${label}`);

          return completionItem;
        })
    );
  }
}

export default SnippetCompletionItemProvider;
