# MDS CourseCard proof of concept: note

My courses (cards view) now renders each course with the Moodle Design System `CourseCard` from the unreleased MDS-CC branch. This is a proof of concept, not ready to merge. PR: https://github.com/leslielee888888/moodle/pull/7. Follow-ups: issue #11.

## How to run it

Needs Node 22 (`engines` is `>=22.11.0 <23`, `.nvmrc` is `lts/jod`; Node 24 is not supported; grunt refused it) and a running Moodle. I used simpledocker (`./start-moodle.sh`) with this repo as the site's code.

1. Check out this branch and run `npm ci`. It installs the MDS-CC tarball from `.mds/`, and its `postinstall` regenerates `public/lib/bundles/design-system`.
2. The built files are committed (`public/course/js/esm/build`, `public/blocks/myoverview/amd/build`, `public/theme/boost/style/moodle.css`), so no grunt run is needed to look at it. After editing sources, run `npx grunt esm` and `npx grunt amd`.
3. Purge all caches (Site administration > Development > Purge all caches).
4. Log in as a user enrolled in a few courses. Make one course hidden from students and enable completion on another so the badge and the progress bar show.
5. Open `/my/courses.php`, set the view to Card.

To get the legacy card back, run `document.cookie = "mds_coursecard=0; path=/"` in the browser console and reload. Delete the cookie to return to the MDS card.

## What changed

Hand-written:

- `public/course/js/esm/src/CourseCard.tsx`: wrapper from Moodle's raw course data to the MDS props.
- `public/course/js/esm/src/CourseCardList.tsx`: one React root for the whole grid, not one per course.
- `public/course/js/esm/src/swizzle.json`: entry for the new component.
- `public/blocks/myoverview/templates/view-cards-mds.mustache`: passes the course data to `{{#react}}`, with a skeleton as the fallback.
- `public/blocks/myoverview/amd/src/view.js`: picks the MDS template unless the cookie above is `0`.
- Tests under `public/course/js/esm/tests` and `public/blocks/myoverview/js/esm/tests`, one lang string (`continuelearning`), skeleton styles.

Generated, not worth reviewing line by line: `public/lib/bundles/design-system/**`, `*/build/**`, `moodle.css`.

## Packaging decision

`dist` is not committed upstream and `prepare` only runs husky, so a git dependency would install no build output. A `^5.x` range does not match a prerelease either. So I built the MDS-CC branch at commit `c7cfa0b`, versioned it `5.4.1-mds-cc.0` so it cannot be confused with the published 5.4.0, packed it, and committed the tarball under `.mds/` with a relative `file:` dependency. Anyone who clones the branch can run `npm ci`.

For production I would not commit tarballs. MDS CI would publish prerelease builds to Moodle's registry under a dist-tag, and Moodle would pin the exact version.

## Shortcuts I took

- The action menu (hide, remove from view) and the favourite star are gone from the cards. The component has nowhere to put them.
- The footer link ("Continue learning") is a placeholder. Only that link navigates.
- No Behat run (issue #6 and #11 item 14), no PHP tests or phpcs, no automated browser test.
- `moodle.css` was rebuilt with sass because grunt refused Node 24. The rebuild also carries the other MDS-CC changes (a replaced breadcrumb, new selectors). Check breadcrumbs site-wide before trusting it.
- The cookie switch is demo-only.

## What I tested

- Jest, run on this branch: 5 suites, 48 tests passing (`npx jest public/course/js/esm/tests public/blocks/myoverview/js/esm/tests`). They cover the wrapper rendered with the real MDS card, the list, a smoke test that Jest can import the ESM-only package, and a template test for stray `{{` and `}}` and hostile course names breaking the props JSON.
- By hand, in the browser: the dashboard cards view only.
- Not tested: Behat, other themes, RTL, dark mode, other pages.

## Wider implications

- The `view.js` handlers for favourite, hide and show look for `data-action` elements that no longer exist in the MDS cards. They never fire and raise no error. A course a user already removed from view cannot be restored from the MDS card, because "Restore to view" lived in the menu.
- Behat scenarios that click the menu or the star will fail (issue #11 counts 16; I have not run them).
- Still on the legacy card: the Recently accessed courses block and `course/templates/view-cards.mustache`. The list and summary views of My courses are unchanged.
- The MDS footer arrow is a hardcoded Font Awesome class.

## Measured payload

The cards view puts every course into one `data-react-props` attribute. For 96 courses that is about 1.2 MB, 97 to 98 percent of it the generated course image as a base64 data URI. `JSON.parse` of it takes under 1 ms in Node. This was measured on the server side with Node only; the browser render cost is not measured. The generated image is already served at `/pluginfile.php/<contextid>/course/generated/0/course.svg`, but the web service response carries no context id, so using it needs an exporter change (issue #11 item 17).

## Suggestions for the MDS component

- Let the title (and image) be a link, so the whole card can navigate.
- Add a slot for actions (menu, favourite). Without it every consumer must put them beside the card.
- Allow more than one badge.
- Support line clamping for long titles.
- Do not hardcode the Font Awesome arrow; take an icon prop or render an inline icon.
- Let the footer link take an accessible name per card. Every link reads "Continue learning", so the wrapper patches `aria-label` in a `useEffect`, which is a workaround for an API gap.

## Next steps

Rewrite the Behat scenarios once the interaction model is agreed with design. Check the card in a browser across themes, RTL and dark mode, and add visual regression tests. Record a performance trace at 96 courses per page. Have the server send plain text so the wrapper can drop `htmlToText`. Change the exporter to return the image URL. Decide the menu and favourite design with the MDS team. Move the tarball to a registry.

## How I used AI and how I checked it

TODO(Leslie): confirm and edit. Draft from the working session:

- AI said the cards were server-rendered. Reading the code showed the card Mustache renders in the browser from an AJAX response.
- AI called a navigation component server-rendered. Only its data comes from the server.
- AI guessed the design system loads on demand. The Network panel (63 requests, all initiated by `index.js`) showed one bundle.
- AI guessed `JSON.parse` of the props would be the main cost. Measuring showed under 1 ms.
- Method: read the source, measure, run the tests, reproduce in the browser, and keep a claim only if the evidence supports it.

## Time spent

TODO(Leslie): add honest time spent.
