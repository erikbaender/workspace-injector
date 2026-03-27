# Workspace Injector

![Workspace Injector demo](.github/assets/workspace-injector-demo.gif)

This Visual Studio Code extension helps you open an existing workspace file with the currently opened folder injected as the primary folder.

This allows you to decouple your personal tooling from the `.vscode` directory in a production repository to a `.code-workspace` file without being forced into the workspace-based workflow, which is by itself not designed for this purpose and would result in you either having to manually edit the folder paths to switch between the active repository in your workspace, or in keeping multiple copies of the same workspace configuration for different repositories which all have to be synced and maintained separately.




## Commands

- `Workspace Injector: Inject Open Folder Into Workspace`

    1. Prompts you to select a `.code-workspace` file.
    2. Rewrites that same workspace file in place.
    3. Sets `folders` to exactly two entries:
    4. First entry: currently opened folder.
    5. Second entry: directory containing the selected workspace file.
    6. Opens the selected workspace file in the current window.

## Behavior Notes

- The selected workspace file is directly modified; no temporary workspace copy is created.
- The picker remembers the last directory you selected a workspace file from.
- If there are unsaved editors, the extension asks for confirmation before switching windows.

## Development

```bash
npm install
npm run build
```

Press `F5` in VS Code to launch an Extension Development Host.

For maintainer release and publishing steps, see [RELEASING.md](RELEASING.md).
