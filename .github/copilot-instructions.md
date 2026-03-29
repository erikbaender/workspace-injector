# Copilot Instructions for Workspace Injector

## Purpose

This extension updates an existing `.code-workspace` file so it matches the currently opened folder context.

## Current Runtime Behavior

When `workspaceInjector.openWorkspaceWithCurrentFolder` runs:

1. Resolve the currently opened folder from the active workspace.
2. Prompt the user to pick a `.code-workspace` file.
3. Remember the parent directory of the picked workspace file in global state key `workspaceInjector.lastWorkspaceDirectory`.
4. Parse the selected workspace file as JSON.
5. Overwrite `folders` with exactly two `path` entries in this order:
6. First path: the currently opened folder.
7. Second path: the directory containing the selected workspace file.
8. Write the updated JSON back to the same selected workspace file.
9. Open that workspace file in the current window with `vscode.openFolder` and `forceReuseWindow: true`.

## Important Constraints

- Do not create temporary workspace copies.
- Keep in-place updates deterministic: preserve stable JSON formatting (`JSON.stringify(..., null, 4)`).
- Keep folder order fixed: opened folder first, workspace-directory second.
- Keep picker default location behavior: use stored last directory when available.

## Refactoring Guidance

- Keep command IDs and state keys synchronized between `package.json` and `src/extension.ts`.
- Prefer clear naming with "workspace" and "context" terminology, not "template" terminology.
- Keep `README.md` user-focused. Store maintainer release and publishing details in `RELEASING.md`.
- If runtime behavior changes, update this file and `README.md` in the same change.
- If release automation changes, update `.github/workflows/ci.yml`, `.github/workflows/publish.yml`, and `RELEASING.md` in the same change.

## Release Automation

- CI workflow: `.github/workflows/ci.yml` runs build validation on push and pull request.
- Publish workflow: `.github/workflows/publish.yml` runs only when manually triggered (`workflow_dispatch`).
- Publish workflow requirements:
	- Repository secret `VSCE_PAT` must be configured.
	- Extension version must be set in `package.json` before triggering publish.
	- Publish workflow does not mutate or commit version files.
	- Publish uses `--skip-duplicate` so reruns of the same version are safe.
	- Manual input `prerelease=true` publishes with `--pre-release`.
