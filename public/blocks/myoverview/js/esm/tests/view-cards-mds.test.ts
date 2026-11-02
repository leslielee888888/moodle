// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Guards block_myoverview's MDS cards view template (and the Course card skeleton partial it
 * includes) against stray Mustache braces, and checks the single React mount point it renders
 * (see GitHub issues #14 and #10, parent #11).
 *
 * This is also the regression test for a real bug (see GitHub issue #8, fixed for issue #5): the
 * cards template's docblock once mentioned a literal "{{#react}}" tag. That tag's own closing
 * braces ended the Mustache comment early, and the rest of the docblock text was printed onto the
 * dashboard, above the course grid.
 *
 * The template is rendered with the vendored core/mustache engine (public/lib/amd/src/mustache.js)
 * and ports of the repo's `quote`, `str` and `react` renderer helpers (see
 * ./mustacheTestHelpers.ts) - the same approach used for an earlier, unsaved Node+jsdom check of
 * this bug. It does not import @moodle/lms/core_course/CourseCard, core_course/CourseCardList, or
 * any other @moodlehq/design-system package, so the ESM-only Jest resolution problem does not
 * apply.
 *
 * @module     block_myoverview/tests/view-cards-mds
 * @copyright  2026 Leslie Lee <leslielee888888@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import fs from "fs";
import path from "path";
import {
  assertCommentsCloseWhereIntended,
  withRendererHelpers,
} from "./mustacheTestHelpers";

/** Minimal surface of the vendored engine's render() this test calls. */
interface MustacheEngine {
  render: (
    template: string,
    view: unknown,
    partials?: Record<string, string>,
  ) => string;
}

// The ".js" transform in jest.config.js (added for @moodlehq/design-system, see GitHub issue #9)
// compiles this plain-ESM file's "export default mustache;" to CommonJS via esModuleInterop,
// which puts the engine on the module's `default` property rather than on `module.exports`
// itself; fall back to the module object directly in case that ever changes.
const mustacheModule: {
  default?: MustacheEngine;
} & Partial<MustacheEngine> = require("../../../../../lib/amd/src/mustache.js");
const mustache: MustacheEngine =
  mustacheModule.default ?? (mustacheModule as MustacheEngine);

const templatesDir = path.join(__dirname, "../../../templates");
const viewCardsSource = fs.readFileSync(
  path.join(templatesDir, "view-cards-mds.mustache"),
  "utf8",
);
const placeholderSource = fs.readFileSync(
  path.join(templatesDir, "placeholder-course-mds.mustache"),
  "utf8",
);

const PARTIAL_NAME = "block_myoverview/placeholder-course-mds";
const LIST_COMPONENT = "@moodle/lms/core_course/CourseCardList";

/** A plain, well-behaved course - the baseline for checks that should produce clean output. */
const plainCourseA = {
  id: 11,
  viewurl: "https://moodle.test/course/view.php?id=11",
  courseimage:
    "https://moodle.test/pluginfile.php/11/course/overviewfiles/11.jpg",
  fullname: "Introduction to Statistics",
  shortname: "stats101",
  hasprogress: true,
  progress: 42,
  coursecategory: "Mathematics",
  showcoursecategory: true,
  showshortname: false,
  visible: true,
};

const plainCourseB = {
  id: 12,
  viewurl: "https://moodle.test/course/view.php?id=12",
  courseimage:
    "https://moodle.test/pluginfile.php/12/course/overviewfiles/12.jpg",
  fullname: "History of Art",
  shortname: "art200",
  hasprogress: false,
  progress: null,
  coursecategory: "Humanities",
  showcoursecategory: false,
  showshortname: true,
  visible: true,
};

/** A course whose data fields are hostile to both Mustache and JSON. */
const hostileCourse = {
  id: 13,
  viewurl: "https://moodle.test/course/view.php?id=13",
  courseimage:
    "https://moodle.test/pluginfile.php/13/course/overviewfiles/13.jpg",
  fullname: 'Course {{ "quoted" }} & <tag> \\ backslash',
  shortname: 'sn{{}}"&<\\x',
  hasprogress: false,
  progress: null,
  coursecategory: 'Category {{ }} "quoted" & <tag> \\ backslash',
  showcoursecategory: true,
  showshortname: true,
  visible: true,
};

/** Hasprogress is true but progress is empty - the template must fall back to 0, not null. */
const emptyProgressCourse = {
  id: 14,
  viewurl: "https://moodle.test/course/view.php?id=14",
  courseimage:
    "https://moodle.test/pluginfile.php/14/course/overviewfiles/14.jpg",
  fullname: "Just Started",
  shortname: "start14",
  hasprogress: true,
  progress: null,
  coursecategory: "Mathematics",
  showcoursecategory: true,
  showshortname: false,
  visible: true,
};

/** A hidden course. */
const hiddenCourse = {
  id: 15,
  viewurl: "https://moodle.test/course/view.php?id=15",
  courseimage:
    "https://moodle.test/pluginfile.php/15/course/overviewfiles/15.jpg",
  fullname: "Retired Course",
  shortname: "retired15",
  hasprogress: false,
  progress: null,
  coursecategory: "Archive",
  showcoursecategory: true,
  showshortname: false,
  visible: false,
};

/**
 * Adds the `islast` flag block_myoverview/view.js computes for every course before rendering,
 * which the template needs to separate the courses it writes into its single JSON array with
 * commas (see the template's own docblock: Mustache has no "not last" primitive for a plain array
 * section).
 */
function withIsLast(
  courses: Record<string, unknown>[],
): Record<string, unknown>[] {
  return courses.map((course, index, array) => ({
    ...course,
    islast: index === array.length - 1,
  }));
}

/**
 * Renders block_myoverview/view-cards-mds with the given courses, using the vendored engine and
 * the ported quote/str/react helpers, and returns both the raw HTML and a parsed container to
 * query it with.
 */
function renderCardsView(
  courses: Record<string, unknown>[],
  templateSource: string = viewCardsSource,
): { html: string; container: HTMLDivElement } {
  const view = withRendererHelpers({ courses: withIsLast(courses) });
  const partials = { [PARTIAL_NAME]: placeholderSource };
  const html = mustache.render(templateSource, view, partials).trim();

  const container = document.createElement("div");
  container.innerHTML = html;

  return { html, container };
}

/** Every non-whitespace text node in `root`, except those inside a ".visually-hidden" element. */
function strayVisibleText(root: HTMLElement): string[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const found: string[] = [];

  let node = walker.nextNode();
  while (node) {
    const text = (node.textContent ?? "").trim();
    const insideHiddenNode =
      node.parentElement?.closest(".visually-hidden") !== null &&
      node.parentElement?.closest(".visually-hidden") !== undefined;

    if (text !== "" && !insideHiddenNode) {
      found.push(text);
    }

    node = walker.nextNode();
  }

  return found;
}

describe("block_myoverview/view-cards-mds and block_myoverview/placeholder-course-mds", () => {
  describe("every Mustache comment closes where intended", () => {
    it.each([
      ["view-cards-mds.mustache", () => viewCardsSource],
      ["placeholder-course-mds.mustache", () => placeholderSource],
    ])(
      '%s has no comment containing a literal "{{" or "}}"',
      (name, getSource) => {
        expect(() =>
          assertCommentsCloseWhereIntended(getSource(), name),
        ).not.toThrow();
      },
    );
  });

  describe("rendering with ordinary courses", () => {
    it("produces no text outside the course grid", () => {
      // Deliberately not asserting on the raw HTML as a whole here: a correctly-rendered
      // data-react-props JSON attribute legitimately contains adjacent "}}" wherever one object
      // closes right before its parent does (e.g. "...strings":{...}}" below), which is not a
      // stray brace leak. The real signal for a leak - visible text outside the grid, which is
      // exactly what the historical docblock bug produced - is checked via strayVisibleText.
      const { container } = renderCardsView([plainCourseA, plainCourseB]);

      const grid = container.querySelector('[data-region="card-deck"]');
      expect(grid).not.toBeNull();
      expect(strayVisibleText(container)).toEqual([]);
    });

    it("mounts exactly one React root, carrying every course in its props", () => {
      const { container } = renderCardsView([plainCourseA, plainCourseB]);
      const mounts = container.querySelectorAll("[data-react-component]");

      expect(mounts).toHaveLength(1);
      const mount = mounts[0];
      expect(mount.getAttribute("data-react-component")).toBe(LIST_COMPONENT);

      const props = JSON.parse(mount.getAttribute("data-react-props") ?? "{}");
      expect(props.courses).toHaveLength(2);
      expect(props.courses.map((course: { id: number }) => course.id)).toEqual([
        11, 12,
      ]);
      // The courses array itself must be syntactically valid JSON (no missing/extra commas
      // between the per-course objects); JSON.parse above already proves this, since props.courses
      // would otherwise have failed to parse or come back malformed.
    });

    it("sends the shared strings once, at props.strings, not per course", () => {
      const { container } = renderCardsView([plainCourseA, plainCourseB]);
      const mount = container.querySelector("[data-react-component]");
      const props = JSON.parse(mount?.getAttribute("data-react-props") ?? "{}");

      expect(props.strings.continuelearning).toContain("continuelearning");
      expect(props.strings.hiddenfromstudents).toContain("hiddenfromstudents");
      expect(props.courses[0].strings).toBeUndefined();
      expect(props.courses[0].continuelearning).toBeUndefined();
    });

    it("still fills in the per-course progress string from the existing exporter data", () => {
      const { container } = renderCardsView([plainCourseA, plainCourseB]);
      const mount = container.querySelector("[data-react-component]");
      const props = JSON.parse(mount?.getAttribute("data-react-props") ?? "{}");

      // PlainCourseA has progress; plainCourseB does not.
      expect(props.courses[0].completepercent).toContain("completepercent");
      expect(props.courses[1].completepercent).toBeNull();
    });

    it("renders one skeleton grid cell per course in the fallback content, inside the mount", () => {
      const { container } = renderCardsView([plainCourseA, plainCourseB]);
      const mount = container.querySelector("[data-react-component]");
      expect(mount).not.toBeNull();

      const grid = mount?.querySelector('[data-region="card-deck"]');
      expect(grid).not.toBeNull();

      const cells = mount?.querySelectorAll('[role="listitem"]') ?? [];
      expect(cells).toHaveLength(2);
      cells.forEach((cell) => {
        expect(cell.querySelector(".mds-course-card-skeleton")).not.toBeNull();
      });
    });
  });

  describe("rendering with hostile course data", () => {
    // The `quote` helper JSON-encodes course fields, then shields any run of 2-3 curly braces
    // behind a Mustache delimiter-change tag ("{{=<% %>=}}...<%={{ }}=%>") - see quoteHelper in
    // mustacheTestHelpers.ts and public/lib/amd/src/local/templates/renderer.js. That shield is a
    // faithful part of the port: for a course name containing "{{"/"}}", the resulting JSON string
    // is valid and loses no information, but is not byte-identical to the original - the braces
    // come back wrapped in that shield markup rather than bare. `unshield` below undoes exactly
    // that wrapping, so this test can confirm the underlying text (quotes, "&", "<", a backslash,
    // and the braces themselves) survives, without asserting a false byte-for-byte promise.
    const unshield = (text: string): string =>
      text.replace(/\{\{=<% %>=\}\}/g, "").replace(/<%=\{\{ \}\}=%>/g, "");

    it('parses as JSON and keeps quotes, "&", "<" and a backslash exactly intact', () => {
      const { container } = renderCardsView([hostileCourse]);

      const mount = container.querySelector("[data-react-component]");
      expect(mount).not.toBeNull();

      const propsJson = mount?.getAttribute("data-react-props") ?? "";
      expect(() => JSON.parse(propsJson)).not.toThrow();

      const props = JSON.parse(propsJson);
      const course = props.courses[0];

      expect(unshield(course.fullname)).toBe(hostileCourse.fullname);
      expect(unshield(course.shortname)).toBe(hostileCourse.shortname);
      expect(unshield(course.coursecategory)).toBe(
        hostileCourse.coursecategory,
      );
    });

    it('keeps "{{" and "}}" present (shielded, not dropped) in the JSON string value', () => {
      const { container } = renderCardsView([hostileCourse]);
      const mount = container.querySelector("[data-react-component]");
      const props = JSON.parse(mount?.getAttribute("data-react-props") ?? "{}");
      const course = props.courses[0];

      expect(course.fullname).toContain("{{");
      expect(course.fullname).toContain("}}");
    });

    it("keeps the courses array valid JSON even as the single hostile course (also the last)", () => {
      // HostileCourse is simultaneously the only and last course, so this exercises the comma
      // (not-)separator with hostile data standing in the position most likely to break it.
      const { container } = renderCardsView([plainCourseA, hostileCourse]);
      const mount = container.querySelector("[data-react-component]");
      const props = JSON.parse(mount?.getAttribute("data-react-props") ?? "{}");

      expect(props.courses).toHaveLength(2);
      expect(unshield(props.courses[1].fullname)).toBe(hostileCourse.fullname);
    });
  });

  describe("rendering edge-case progress and visibility", () => {
    it("keeps hasprogress-with-empty-progress and a hidden course as valid JSON", () => {
      const { container } = renderCardsView([
        emptyProgressCourse,
        hiddenCourse,
      ]);
      const mount = container.querySelector("[data-react-component]");
      expect(mount).not.toBeNull();

      const props = JSON.parse(mount?.getAttribute("data-react-props") ?? "{}");
      const [progressProps, hiddenProps] = props.courses;

      expect(progressProps.hasprogress).toBe(true);
      expect(progressProps.progress).toBe(0);

      expect(hiddenProps.visible).toBe(false);
      expect(hiddenProps.hasprogress).toBe(false);
      expect(hiddenProps.progress).toBeNull();
    });
  });

  describe("rendering with no courses", () => {
    it("still mounts the single React root, with an empty courses array", () => {
      const { container } = renderCardsView([]);
      const mounts = container.querySelectorAll("[data-react-component]");

      expect(mounts).toHaveLength(1);
      const props = JSON.parse(
        mounts[0].getAttribute("data-react-props") ?? "{}",
      );
      expect(props.courses).toEqual([]);
    });
  });

  describe('regression: a literal "{{#react}}" reintroduced into the docblock', () => {
    // Reconstructs the exact bug fixed for GitHub issue #5 (see commit "stop the MDS cards
    // template docblock closing early") on an in-memory copy of the template text. The real
    // template file on disk is never modified.
    const knownGoodText = "Each React mount point's fallback content";
    const buggyText = "Each {{#react}} mount point's fallback content";

    it("is present in the current template as a sanity check for the regression below", () => {
      expect(viewCardsSource).toContain(knownGoodText);
    });

    it("is caught by the comment guard", () => {
      const buggySource = viewCardsSource.replace(knownGoodText, buggyText);
      expect(buggySource).not.toBe(viewCardsSource);

      expect(() =>
        assertCommentsCloseWhereIntended(
          buggySource,
          "view-cards-mds.mustache",
        ),
      ).toThrow(/contains a literal "\{\{" or "\}\}"/);
    });

    it("is also caught by rendering: the leaked docblock text appears outside the grid", () => {
      const buggySource = viewCardsSource.replace(knownGoodText, buggyText);
      const { html, container } = renderCardsView([plainCourseA], buggySource);

      expect(html).toContain("mount point");
      expect(strayVisibleText(container).join(" ")).toContain("mount point");
    });
  });
});
