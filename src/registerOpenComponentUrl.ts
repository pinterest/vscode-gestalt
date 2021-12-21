import * as vscode from "vscode";
import log from "./log";
import track from "./track";
import { snippets } from "./snippets.json";

async function openComponentUrl({ label }: { label: string }): Promise<void> {
  const snippet = snippets.find(({ name }) => name === label);
  const url = snippet?.description.match(/(https?:\/\/[^\s]+)/g)?.[0] ?? "";
  const parsedUrl = url.endsWith(")") ? url.slice(0, -1) : url;

  log.append("openComponentUrl" + " " + url);
  track.event({
    category: "Event",
    action: "Count",
    label: "openComponentUrl",
    value: String(1),
  });
  track.event({
    category: "Event",
    action: "Count",
    label: "OpenComponentUrlLogUrl",
    value: parsedUrl,
  });
  await vscode.env.openExternal(vscode.Uri.parse(parsedUrl));
}

export default function registerOpenComponentUrl() {
  vscode.commands.registerCommand("gestalt.openComponentUrl", openComponentUrl);
}
