var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * The Course card wrapper: a pure adapter from Moodle course data to the design system's
 * CourseCard. Used by the My courses MDS cards view (a cookie-switched proof of concept, see
 * GitHub issues #1 and #3).
 *
 * @module     core_course/CourseCard
 * @copyright  2026 Leslie Lee <leslielee888888@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { CourseCard as MdsCourseCard } from "@moodlehq/design-system";
function CourseCard({
  id,
  fullname,
  viewurl,
  courseimage,
  strings
}) {
  const hookAttributes = {
    "data-region": "course-content",
    "data-course-id": id
  };
  return /* @__PURE__ */ jsxDEV(
    MdsCourseCard,
    {
      title: fullname,
      imageSrc: courseimage,
      imageAlt: "",
      linkLabel: strings.continuelearning,
      linkHref: viewurl,
      role: "listitem",
      ...hookAttributes
    },
    void 0,
    false,
    {
      fileName: "public/course/js/esm/src/CourseCard.tsx",
      lineNumber: 90,
      columnNumber: 5
    },
    this
  );
}
__name(CourseCard, "CourseCard");
export {
  CourseCard as default
};
//# sourceMappingURL=CourseCard.dev.js.map
