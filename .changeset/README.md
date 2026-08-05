# Changesets

This folder holds [changesets](https://github.com/changesets/changesets): one
markdown file per change, declaring which package it affects and how much the
version should move.

## Adding one

```bash
pnpm changeset
```

Pick `@abbainitiative/ui`, choose a bump type, and write the line that will
appear in the changelog. Commit the generated file with your change.

## Which bump type

- **patch** — bug fixes, and visual corrections that do not change layout.
- **minor** — new components, new props, new tokens. Existing code keeps working.
- **major** — removed or renamed props, changed default behaviour, removed
  tokens, or a raised React peer range.

Class names are not part of the public API — they are content-hashed and change
between builds, so a change to one is not a breaking change. Token names **are**
public: removing or renaming one is.

## Changes that need no changeset

Documentation-site work, CI configuration, and repository tooling do not affect
the published package. `@abbainitiative/docs` is listed under `ignore` in
`config.json` for this reason.

## Releasing

CI accumulates changesets into a release pull request. Merging it versions the
package, writes `CHANGELOG.md`, and publishes to npm.
