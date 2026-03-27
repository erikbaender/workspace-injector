# Workspace Injector (VS Code Extension)

This extension helps you open an existing `.code-workspace` file with the currently opened folder injected as the primary folder.

When you run the command, it:

1. Prompts you to select a `.code-workspace` file.
2. Rewrites that same workspace file in place.
3. Sets `folders` to exactly two entries:
4. First entry: currently opened folder.
5. Second entry: directory containing the selected workspace file.
6. Opens the selected workspace file in the current window.

## Command

- `Workspace Injector: Inject Open Folder Into Workspace`

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
