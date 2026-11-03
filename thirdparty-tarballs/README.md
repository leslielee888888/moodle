# Third-party tarballs

Vendored npm tarballs that cannot come from the public registry yet. Each one
is referenced from `package.json` / `npm-shrinkwrap.json` with a relative
`file:` path, so `npm ci` installs it with no network access beyond the usual
registry and no machine-local paths.

## `moodlehq-design-system-5.4.0.tgz`

A pre-release build of `@moodlehq/design-system`, vendored so the
`integration/mds-coursecard-poc` branch (and anything built on it) can run
`npm install`/`npm ci` on any machine, including CI.

- **Upstream repository:** https://github.com/moodlehq/design-system
- **Branch:** `MDS-CC`
- **Commit:** `c7cfa0bb4e1b366d18e710fbeedb2c6829fe81bf` (`c7cfa0b`)
- **Package version recorded inside the tarball:** `5.4.0-mdscc.c7cfa0b`
  (SemVer pre-release of the real `5.4.0` the upstream repo's `package.json`
  carries at that commit — this sorts below the eventual published `5.4.0`
  release and cannot be confused with it, while the `c7cfa0b` suffix says
  exactly which MDS-CC commit it was built from).
- **File name** is left as `moodlehq-design-system-5.4.0.tgz` (unchanged from
  the original pack) even though the version inside is the `-mdscc.c7cfa0b`
  pre-release — only the `version` field inside the tarball's `package.json`
  was rewritten; every other file is byte-for-byte identical to a plain
  `npm pack` of the upstream commit.

### How this tarball was produced

1. Build upstream at the pinned commit, in a worktree/clone outside of this
   repo's checkout of `design-system` (its tracked files must not change):

   ```sh
   git clone https://github.com/moodlehq/design-system.git /tmp/mds-cc-build
   cd /tmp/mds-cc-build
   git checkout c7cfa0bb4e1b366d18e710fbeedb2c6829fe81bf
   npm ci
   npm run build        # produces dist/, which upstream gitignores
   npm pack              # produces moodlehq-design-system-5.4.0.tgz
   ```

2. Rewrite the version inside the tarball (do this instead of re-running
   `npm pack` with a bumped `package.json` version, so the file name stays
   `moodlehq-design-system-5.4.0.tgz` and nothing else in the tarball
   changes):

   ```sh
   mkdir /tmp/mds-cc-repack && cd /tmp/mds-cc-repack
   tar xzf /tmp/mds-cc-build/moodlehq-design-system-5.4.0.tgz
   sed -i 's/"version": "5.4.0",/"version": "5.4.0-mdscc.c7cfa0b",/' package/package.json
   tar tf /tmp/mds-cc-build/moodlehq-design-system-5.4.0.tgz > /tmp/mds-cc-order.txt
   tar --owner=0 --group=0 --mode=644 --mtime='1985-10-26 18:15:00 UTC' \
       -czf moodlehq-design-system-5.4.0.tgz -T /tmp/mds-cc-order.txt
   ```

3. Verify parity with the previous tarball before committing the new one:
   the file list must be identical, and every file's hash must match except
   `package/package.json`, whose only difference must be the `version` line.

   ```sh
   diff <(tar tf OLD.tgz | sort) <(tar tf NEW.tgz | sort)
   # extract both to temp dirs, then:
   diff -rq --exclude=package.json OLD_DIR NEW_DIR
   ```

### How to refresh the shrinkwrap and `lib/bundles` after changing this tarball

From the Moodle repo root:

```sh
npm install   # updates npm-shrinkwrap.json's resolved/integrity for this
              # package and re-runs the postinstall update-packages step,
              # which refreshes lib/bundles/design-system
```

Only the `@moodlehq/design-system` entries in `npm-shrinkwrap.json` should
change. Check the diff in `lib/bundles/design-system` afterwards — it should
be empty, or limited to the version string, unless this tarball's contents
changed.

Also update the version recorded for `bundles/design-system` in
`lib/thirdpartylibs.xml` to match.

### Switching to a published release

Once `moodlehq/design-system` publishes a release that includes
`CourseCard`, delete this file, this folder (if nothing else needs it), and
the recipe above, and change the `@moodlehq/design-system` dependency in
`package.json` back to an ordinary registry version range.
