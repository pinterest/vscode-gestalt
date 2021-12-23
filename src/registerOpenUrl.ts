import * as vscode from "vscode";
import log from "./log";
import track from "./track";

async function openUrl({ url }: { url: string }): Promise<void> {
  log.append("openUrl" + " " + url);
  track.event({
    category: "Event",
    action: "Count",
    label: "OpenUrl",
    value: String(1),
  });
  track.event({
    category: "Event",
    action: "Count",
    label: "OpenUrlLogUrl",
    value: url,
  });
  await vscode.env.openExternal(vscode.Uri.parse(url));
}

export default function registerOpenUrl() {
  vscode.commands.registerCommand("gestalt.openUrl", openUrl);
}
