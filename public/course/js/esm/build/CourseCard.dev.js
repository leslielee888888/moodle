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
import { useEffect, useRef } from "react";
import { CourseCard as MdsCourseCard } from "@moodlehq/design-system";
function htmlToText(html) {
  if (html === void 0) {
    return void 0;
  }
  return new DOMParser().parseFromString(html, "text/html").body.textContent ?? "";
}
__name(htmlToText, "htmlToText");
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
  const plainFullname = htmlToText(fullname);
  const plainShortname = htmlToText(shortname);
  const plainCategory = htmlToText(coursecategory);
  const subtitle = getSubtitle({
    showcoursecategory,
    coursecategory: plainCategory,
    showshortname,
    shortname: plainShortname
  });
  const badgeLabel = !visible ? htmlToText(strings.hiddenfromstudents) : void 0;
  const progressLabel = hasprogress ? htmlToText(strings.completepercent) : void 0;
  const progressValue = progress ?? void 0;
  const plainLinkLabel = htmlToText(strings.continuelearning);
  const cardRef = useRef(null);
  useEffect(() => {
    const link = cardRef.current?.querySelector("a.mds-link");
    if (!link || !plainLinkLabel) {
      return void 0;
    }
    link.setAttribute("aria-label", `${plainLinkLabel}: ${plainFullname}`);
    return () => link.removeAttribute("aria-label");
  }, [plainLinkLabel, plainFullname, viewurl]);
  return /* @__PURE__ */ jsxDEV(
    MdsCourseCard,
    {
      ref: cardRef,
      "aria-label": plainFullname,
      title: plainFullname,
      headingLevel: 3,
      subtitle,
      imageSrc: courseimage,
      imageAlt: "",
      badgeLabel,
      progressLabel,
      progressValue,
      linkLabel: plainLinkLabel,
      linkHref: viewurl,
      className: "w-100 h-100",
      ...hookAttributes
    },
    void 0,
    false,
    {
      fileName: "public/course/js/esm/src/CourseCard.tsx",
      lineNumber: 200,
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
