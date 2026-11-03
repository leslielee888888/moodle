# MDS CourseCard proof of concept: how to run it

My courses (cards view) renders each course with the unreleased MDS-CC `CourseCard`. Proof of concept, not ready to merge. PR: https://github.com/leslielee888888/moodle/pull/7

Needs Node 22 (`engines` is `>=22.11.0 <23`) and a running Moodle. I used simpledocker with this repo as the site's code.

1. Check out this branch and run `npm ci`. It installs the MDS-CC tarball from `.mds/`; `postinstall` regenerates `public/lib/bundles/design-system`.
2. Purge all caches (Site administration > Development > Purge all caches).
3. Log in as a user enrolled in a few courses. Make one course hidden from students and turn on completion in another, so the badge and the progress bar show.
4. Open `/my/courses.php` and set the view to Card.

The built files are committed, so grunt is not needed to look at it. After editing sources run `npx grunt esm` and `npx grunt amd`.

To get the legacy card back, run `document.cookie = "mds_coursecard=0; path=/"` in the browser console and reload.

Tests: `npx jest public/course/js/esm/tests public/blocks/myoverview/js/esm/tests`

Shortcuts, risks and next steps are in the PR description ("Merge Danger") and issue #11.
