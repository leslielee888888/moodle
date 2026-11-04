var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * The Course card list element: `<mds-course-card-list>`, the My courses MDS cards grid delivered
 * as a custom element instead of through the `{{#react}}` mount helper. Opt-in through the
 * `mds_coursecard_ce` cookie (see block_myoverview/view-cards-mds-ce.mustache).
 *
 * The element renders in the light DOM, because the MDS styles are global CSS. It reads its
 * attributes once, when it connects, and unmounts its React root when it disconnects: My courses
 * re-renders by injecting fresh HTML, so every update is a new element.
 *
 * Attributes:
 * - `courses`: a JSON array of course objects (see CourseListItem). Invalid JSON renders no cards.
 *   Each course's `completepercent` is optional and may contain the `%PROGRESS%` placeholder, which
 *   is replaced by the course's own progress.
 * - `continuelearning`, `hiddenfromstudents`: the strings shared by every card.
 * - `completepercent`: the progress label template shared by every card, containing the
 *   `%PROGRESS%` placeholder. Used when a course has progress and no label of its own.
 *
 * @module     core_course/CourseCardListElement
 * @copyright  2026 Leslie Lee <leslielee888888@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { createRoot } from "react-dom/client";
import CourseCardList from "@moodle/lms/core_course/CourseCardList";
const TAG_NAME = "mds-course-card-list";
const PROGRESS_PLACEHOLDER = "%PROGRESS%";
function parseCourses(raw) {
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
__name(parseCourses, "parseCourses");
function withProgressLabels(courses, template) {
  if (!template) {
    return courses;
  }
  return courses.map(
    (course) => course.completepercent !== void 0 || !course.hasprogress || course.progress === null ? course : {
      ...course,
      completepercent: template.replace(
        PROGRESS_PLACEHOLDER,
        String(course.progress)
      )
    }
  );
}
__name(withProgressLabels, "withProgressLabels");
class CourseCardListElement extends HTMLElement {
  static {
    __name(this, "CourseCardListElement");
  }
  #root = null;
  connectedCallback() {
    const courses = withProgressLabels(
      parseCourses(this.getAttribute("courses")),
      this.getAttribute("completepercent")
    );
    const container = document.createElement("div");
    this.replaceChildren(container);
    this.#root = createRoot(container);
    this.#root.render(
      /* @__PURE__ */ jsxDEV(
        CourseCardList,
        {
          courses,
          strings: {
            continuelearning: this.getAttribute("continuelearning") ?? void 0,
            hiddenfromstudents: this.getAttribute("hiddenfromstudents") ?? void 0
          }
        },
        void 0,
        false,
        {
          fileName: "public/course/js/esm/src/CourseCardListElement.tsx",
          lineNumber: 113,
          columnNumber: 7
        },
        this
      )
    );
  }
  disconnectedCallback() {
    this.#root?.unmount();
    this.#root = null;
  }
}
if (!customElements.get(TAG_NAME)) {
  customElements.define(TAG_NAME, CourseCardListElement);
}
export {
  CourseCardListElement,
  PROGRESS_PLACEHOLDER,
  TAG_NAME,
  parseCourses
};
//# sourceMappingURL=CourseCardListElement.dev.js.map
