# Releasing Workspace Injector

This guide is for maintainers.

## Automated Workflows

This repository includes GitHub Actions workflows for automated build and publish:

- CI build runs on every push and pull request.
- Marketplace publish runs when a GitHub Release is published.

## One-time Setup

1. Add a repository secret named `VSCE_PAT`.
2. Set the secret value to a Visual Studio Marketplace Personal Access Token that can publish extensions.

## Publish Flow

1. Create and publish a GitHub Release with tag `v<version>` (for example `v0.0.2`).
2. The publish workflow derives the extension version from the release tag.
3. The workflow updates `package.json` and `package-lock.json` to that version and pushes the change to the default branch.
4. The workflow packages and publishes to the Marketplace.

### Pre-release behavior

- If the GitHub Release is marked as pre-release, the workflow publishes a Marketplace pre-release (`vsce publish --pre-release`).
- If the GitHub Release is not marked as pre-release, the workflow publishes a normal Marketplace release.

### Tag requirements

- Tags must use format `v<major>.<minor>.<patch>`.
- Example: `v0.0.2`.

## Local Packaging And Publish Commands

```bash
npm run build
npm run package
npm run publish:vsce
```
