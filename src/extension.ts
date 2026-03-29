import * as vscode from "vscode";
import { COMMAND_ID, LAST_WORKSPACE_DIRECTORY_KEY } from "./constants";

type WorkspaceFile = {
    folders?: Array<{ name?: string; path?: string; uri?: string }>;
    [key: string]: unknown;
};

const textDecoder = new TextDecoder("utf-8");
const textEncoder = new TextEncoder();

export function activate(context: vscode.ExtensionContext): void {
    const disposable = vscode.commands.registerCommand(COMMAND_ID, async () => {
        await openWorkspaceWithCurrentFolderContext(context);
    });

    context.subscriptions.push(disposable);
}

export function deactivate(): void {
    // No teardown required.
}

async function openWorkspaceWithCurrentFolderContext(context: vscode.ExtensionContext): Promise<void> {
    const currentFolder = resolveCurrentFolder();
    if (!currentFolder) {
        void vscode.window.showErrorMessage("No folder is currently open. Open a folder first.");
        return;
    }

    const workspaceFileUri = await pickWorkspaceFile(context);
    if (!workspaceFileUri) {
        return;
    }

    const proceed = await confirmIfDirtyEditors();
    if (!proceed) {
        return;
    }

    let workspaceText: string;
    try {
        const bytes = await vscode.workspace.fs.readFile(workspaceFileUri);
        workspaceText = textDecoder.decode(bytes);
    } catch (error) {
        void vscode.window.showErrorMessage(`Failed to read workspace file: ${formatError(error)}`);
        return;
    }

    const parsed = parseWorkspaceFile(workspaceText);
    if (!parsed) {
        void vscode.window.showErrorMessage("Selected file is not a valid .code-workspace file.");
        return;
    }

    const updatedWorkspace = withInjectedFolders(parsed, currentFolder.uri, workspaceFileUri);
    const wasWritten = await writeWorkspaceFile(workspaceFileUri, updatedWorkspace);
    if (!wasWritten) {
        return;
    }

    await vscode.commands.executeCommand("vscode.openFolder", workspaceFileUri, {
        forceReuseWindow: true,
        noRecentEntry: false
    });
}

function resolveCurrentFolder(): vscode.WorkspaceFolder | undefined {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders || folders.length === 0) {
        return undefined;
    }

    const activeUri = vscode.window.activeTextEditor?.document.uri;
    if (activeUri) {
        const matched = vscode.workspace.getWorkspaceFolder(activeUri);
        if (matched) {
            return matched;
        }
    }

    return folders[0];
}

async function pickWorkspaceFile(context: vscode.ExtensionContext): Promise<vscode.Uri | undefined> {
    const defaultUri = getStoredWorkspaceDirectoryUri(context);
    const selected = await vscode.window.showOpenDialog({
        canSelectMany: false,
        openLabel: "Select Workspace",
        defaultUri,
        filters: {
            "VS Code Workspace": ["code-workspace"]
        }
    });

    const chosen = selected?.[0];
    if (chosen) {
        await context.globalState.update(
            LAST_WORKSPACE_DIRECTORY_KEY,
            getParentDirectoryUri(chosen).toString(true)
        );
    }

    return chosen;
}

async function confirmIfDirtyEditors(): Promise<boolean> {
    const hasDirtyEditors = vscode.workspace.textDocuments.some((doc) => doc.isDirty);
    if (!hasDirtyEditors) {
        return true;
    }

    const answer = await vscode.window.showWarningMessage(
        "Opening this workspace will replace the current window. Continue?",
        { modal: true },
        "Continue"
    );

    return answer === "Continue";
}

function withInjectedFolders(source: WorkspaceFile, folderUri: vscode.Uri, workspaceFileUri: vscode.Uri): WorkspaceFile {
    const clone: WorkspaceFile = JSON.parse(JSON.stringify(source));
    const workspaceDirectoryUri = getParentDirectoryUri(workspaceFileUri);
    clone.folders = [
        { path: toWorkspacePath(folderUri) },
        { path: toWorkspacePath(workspaceDirectoryUri) }
    ];

    return clone;
}

async function writeWorkspaceFile(
    workspaceUri: vscode.Uri,
    workspaceObj: WorkspaceFile
): Promise<boolean> {
    try {
        const content = JSON.stringify(workspaceObj, null, 4);
        await vscode.workspace.fs.writeFile(workspaceUri, textEncoder.encode(content));

        return true;
    } catch (error) {
        void vscode.window.showErrorMessage(`Failed to update workspace file: ${formatError(error)}`);
        return false;
    }
}

function formatError(error: unknown): string {
    if (error instanceof Error && error.message) {
        return error.message;
    }

    return String(error);
}

function parseWorkspaceFile(content: string): WorkspaceFile | undefined {
    try {
        const parsed = JSON.parse(content) as WorkspaceFile;
        if (parsed && typeof parsed === "object") {
            return parsed;
        }

        return undefined;
    } catch {
        return undefined;
    }
}

function toWorkspacePath(uri: vscode.Uri): string {
    if (uri.scheme === "file") {
        return uri.fsPath;
    }

    return uri.path;
}

function getParentDirectoryUri(uri: vscode.Uri): vscode.Uri {
    const normalizedPath = uri.path.replace(/\/+$/, "");
    const lastSlash = normalizedPath.lastIndexOf("/");
    if (lastSlash <= 0) {
        return uri.with({ path: "/" });
    }

    return uri.with({ path: normalizedPath.slice(0, lastSlash) });
}

function getStoredWorkspaceDirectoryUri(context: vscode.ExtensionContext): vscode.Uri | undefined {
    const stored = context.globalState.get<string>(LAST_WORKSPACE_DIRECTORY_KEY);
    if (!stored) {
        return undefined;
    }

    try {
        return vscode.Uri.parse(stored, true);
    } catch {
        return undefined;
    }
}
