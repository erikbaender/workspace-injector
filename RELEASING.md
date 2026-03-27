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

1. Update the extension version in `package.json`.
2. Create and publish a GitHub Release with tag `v<version>` (for example `v0.0.2`).
3. The publish workflow validates that release tag and `package.json` version match, then publishes to the Marketplace.

## Local Packaging And Publish Commands

```bash
npm run build
npm run package
npm run publish:vsce
```
