import * as vscode from 'vscode';

const outputChannel = vscode.window.createOutputChannel('Gestalt');
const append = (text: string): string => {
  const now = new Date();
  const output = `[${[now.getHours(), now.getMinutes(), now.getSeconds()]
    .map((value) => (value + '').padStart(2, '0'))
    .join(':')}] - ${text}`;
  outputChannel.appendLine(output);
  return output;
};

const show = (): void => {
  outputChannel.show();
};

export default {
  append,
  show,
};
