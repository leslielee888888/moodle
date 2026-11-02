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
function getSubtitle({
  showcoursecategory,
  coursecategory,
  showshortname,
  shortname
}) {
  if (showcoursecategory) {
    return coursecategory;
  }
  if (showshortname) {
    return shortname;
  }
  return void 0;
}
__name(getSubtitle, "getSubtitle");
function CourseCard({
  id,
  fullname,
  shortname,
  viewurl,
  courseimage,
  hasprogress,
  progress,
  visible,
  coursecategory,
  showcoursecategory,
  showshortname,
  strings
}) {
  const hookAttributes = {
    "data-region": "course-content",
    "data-course-id": id
  };
  const subtitle = getSubtitle({
    showcoursecategory,
    coursecategory,
    showshortname,
    shortname
  });
  const badgeLabel = !visible ? strings.hiddenfromstudents : void 0;
  const progressLabel = hasprogress ? strings.completepercent : void 0;
  const progressValue = hasprogress && progress !== null ? progress : void 0;
  return /* @__PURE__ */ jsxDEV(
    MdsCourseCard,
    {
      title: fullname,
      subtitle,
      imageSrc: courseimage,
      imageAlt: "",
      badgeLabel,
      progressLabel,
      progressValue,
      linkLabel: strings.continuelearning,
      linkHref: viewurl,
      role: "listitem",
      ...hookAttributes
    },
    void 0,
    false,
    {
      fileName: "public/course/js/esm/src/CourseCard.tsx",
      lineNumber: 138,
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
