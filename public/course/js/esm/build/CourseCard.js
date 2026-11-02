import{CourseCard as i}from"@moodlehq/design-system";import{jsx as u}from"react/jsx-runtime";/**
 * The Course card wrapper: a pure adapter from Moodle course data to the design system's
 * CourseCard. Used by the My courses MDS cards view (a cookie-switched proof of concept, see
 * GitHub issues #1 and #3).
 *
 * @module     core_course/CourseCard
 * @copyright  2026 Leslie Lee <leslielee888888@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function a({id:r,fullname:e,viewurl:o,courseimage:n,strings:s}){const t={"data-region":"course-content","data-course-id":r};return u(i,{title:e,imageSrc:n,imageAlt:"",linkLabel:s.continuelearning,linkHref:o,role:"listitem",...t})}export{a as default};
