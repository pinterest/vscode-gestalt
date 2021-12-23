import * as vscode from "vscode";

export class OpenUrlTreeItem extends vscode.TreeItem {
  public constructor({
    label,
    url,
    icon,
  }: {
    label: string;
    url: string;
    icon: vscode.ThemeIcon;
  }) {
    super(label);
    this.iconPath = icon;
    this.command = {
      title: "Open URL",
      command: "gestalt.openUrl",
      arguments: [
        {
          url,
          location: "tree",
        },
      ],
    };
  }
}

export default class HelpTreeDataProvider
  implements vscode.TreeDataProvider<OpenUrlTreeItem>
{
  data: OpenUrlTreeItem[];

  constructor() {
    this.data = [
      {
        label: "Documentation",
        url: "https://gestalt.pinterest.systems/",
        icon: new vscode.ThemeIcon("book"),
      },
      {
        label: "Review Issues",
        url: "https://github.com/pinterest/gestalt/issues",
        icon: new vscode.ThemeIcon("issues"),
      },
      {
        label: "Report Issue",
        url: "https://github.com/pinterest/gestalt/issues/new/choose",
        icon: new vscode.ThemeIcon("comment"),
      },
      {
        label: "Source Code",
        url: "https://github.com/pinterest/gestalt",
        icon: new vscode.ThemeIcon("github-inverted"),
      },
    ].map(({ label, icon, url }) => new OpenUrlTreeItem({ label, icon, url }));
  }

  getTreeItem(
    element: OpenUrlTreeItem
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(): vscode.ProviderResult<OpenUrlTreeItem[]> {
    return this.data;
  }
}
