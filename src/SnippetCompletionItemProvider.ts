import log from "./log";

import {
  Command,
  CompletionItem,
  CompletionItemKind,
  CompletionItemProvider,
  CompletionList,
  Position,
  Range,
  SnippetString,
  TextDocument,
} from "vscode";
import { snippets } from "./snippets.json";
import { MarkdownString } from "vscode";
import { SnippetParser } from "./snippetParser";

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
          location: "inline",
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
      snippets
        .filter(({ prefix }) => {
          return prefix
            .toLocaleLowerCase()
            .startsWith(textBeforeCursor.toLocaleLowerCase());
        })
        .map(({ prefix, body, name }) => {
          const text = body.join("\n");
          const label = `Gestalt ${name}`;
          return new SnippetCompletionItem({
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
        })
    );
  }
}

export default SnippetCompletionItemProvider;
