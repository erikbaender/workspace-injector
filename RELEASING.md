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
3. The workflow updates `package.json` and `package-lock.json` to that version for the workflow run.
4. The workflow packages and publishes to the Marketplace.
5. After publish succeeds, the workflow attempts to push the version sync commit back to the default branch.

### Retry behavior

- If a release run fails before publish, you can rerun the same release without creating a new version tag.
- Publish uses `--skip-duplicate`, so reruns are safe even if that version was already published.
- Version sync commit is best effort and runs after publish; commit push issues do not block the publish result.

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
