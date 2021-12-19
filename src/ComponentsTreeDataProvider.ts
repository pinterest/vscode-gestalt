import * as vscode from "vscode";
import { snippets } from "./snippets.json";

class TreeItem extends vscode.TreeItem {
  constructor({ description, label }: { description: string; label: string }) {
    super(label);
    this.tooltip = new vscode.MarkdownString(description);
    this.iconPath = new vscode.ThemeIcon("book");
  }
}

export default class ComponentsTreeDataProvider
  implements vscode.TreeDataProvider<TreeItem>
{
  data: TreeItem[];

  constructor() {
    this.data = snippets.map(
      ({ description, name }) => new TreeItem({ description, label: name })
    );
  }

  getTreeItem(element: TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(
    element?: TreeItem | undefined
  ): vscode.ProviderResult<TreeItem[]> {
    return this.data;
  }
}
