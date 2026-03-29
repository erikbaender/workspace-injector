# Releasing Code Workspace Injector

This guide is for maintainers.

## Automated Workflows

This repository includes GitHub Actions workflows for automated build and publish:

- CI build runs on every push and pull request.
- Marketplace publish runs only when triggered manually from GitHub Actions.

## One-time Setup

1. Add a repository secret named `VSCE_PAT`.
2. Set the secret value to a Visual Studio Marketplace Personal Access Token that can publish extensions.

## Publish Flow

1. Update `version` in `package.json` to the version you want to publish.
2. Commit and push your changes (including `package-lock.json` if it changed).
3. Open GitHub Actions and run the **Publish Extension** workflow manually.
4. Set the `prerelease` input:
5. `false` publishes a normal Marketplace release.
6. `true` publishes a Marketplace pre-release (`vsce publish --pre-release`).
7. The workflow builds, packages, and publishes using the package version defined in `package.json`.

### Retry behavior

- If a publish run fails before publish, rerun the same workflow run settings.
- Publish uses `--skip-duplicate`, so reruns are safe even if that version was already published.
- The workflow does not mutate or commit version files.

### Pre-release behavior

- If workflow input `prerelease` is `true`, the workflow publishes a Marketplace pre-release (`vsce publish --pre-release`).
- If workflow input `prerelease` is `false`, the workflow publishes a normal Marketplace release.

## Local Packaging And Publish Commands

```bash
npm run build
npm run package
npm run publish:vsce
```
