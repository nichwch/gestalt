// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { addBookmark, Bookmark, BOOKMARKS } from "./bookmarkStateManager";
import { TagDisplayProvider } from "./TabTreeProvider";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // register all commands

  const rootPath =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined;
  // context.workspaceState.update(BOOKMARKS, []);

  const topViewDataProvider = new TagDisplayProvider(context);
  vscode.window.registerTreeDataProvider(
    "gestaltExplorer",
    topViewDataProvider
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  let addBookmarkCommand = vscode.commands.registerCommand(
    "gestalt.addBookmark",
    async () => {
      const tagsInput =
        (await vscode.window.showInputBox({
          prompt: "enter a list of tags separated by commas",
        })) || "";
      const tags = tagsInput.trim().split(" ");
      const lineNumber =
        (vscode.window.activeTextEditor?.selection?.active?.line || 0) + 1;
      const fileName = vscode.window.activeTextEditor?.document.fileName!;
      addBookmark(context, { tags, fileName, lineNumber });
      vscode.window.showInformationMessage("Add bookmark to gestalt!");
      topViewDataProvider.refresh();
    }
  );

  vscode.commands.registerCommand("gestalt.refreshEntry", () =>
    topViewDataProvider.refresh()
  );

  context.subscriptions.push(addBookmarkCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
