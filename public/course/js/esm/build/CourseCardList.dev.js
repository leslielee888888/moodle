var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * The Course card list: the whole grid of My courses cards as a single React root.
 *
 * Mounted once by the My courses MDS cards view (block_myoverview/view-cards-mds.mustache)
 * instead of one Course card wrapper mount per course (see GitHub issues #14 and #10, parent
 * #11). Renders the grid container (the card-deck region with the list role) and a cell (the
 * list-item role) per course, reusing the Course card wrapper unmodified inside each cell.
 *
 * @module     core_course/CourseCardList
 * @copyright  2026 Leslie Lee <leslielee888888@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import CourseCard from "@moodle/lms/core_course/CourseCard";
function CourseCardList({
  courses,
  strings
}) {
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: "card-grid row gx-2 row-cols-1 row-cols-sm-2 row-cols-lg-3",
      "data-region": "card-deck",
      role: "list",
      children: courses.map(({ completepercent, ...course }) => /* @__PURE__ */ jsxDEV("div", { className: "col d-flex mb-2", role: "listitem", children: /* @__PURE__ */ jsxDEV(
        CourseCard,
        {
          ...course,
          strings: {
            continuelearning: strings.continuelearning,
            hiddenfromstudents: strings.hiddenfromstudents,
            completepercent
          }
        },
        void 0,
        false,
        {
          fileName: "public/course/js/esm/src/CourseCardList.tsx",
          lineNumber: 85,
          columnNumber: 11
        },
        this
      ) }, course.id, false, {
        fileName: "public/course/js/esm/src/CourseCardList.tsx",
        lineNumber: 84,
        columnNumber: 9
      }, this))
    },
    void 0,
    false,
    {
      fileName: "public/course/js/esm/src/CourseCardList.tsx",
      lineNumber: 78,
      columnNumber: 5
    },
    this
  );
}
__name(CourseCardList, "CourseCardList");
export {
  CourseCardList as default
};
//# sourceMappingURL=CourseCardList.dev.js.map
