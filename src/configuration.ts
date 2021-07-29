import * as vscode from "vscode";

const enableTelemetry = async (): Promise<boolean> =>
  !!vscode.workspace.getConfiguration().get("gestalt.enableTelemetry");

export default {
  enableTelemetry,
};
