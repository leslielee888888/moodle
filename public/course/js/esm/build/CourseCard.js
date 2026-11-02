import{CourseCard as p}from"@moodlehq/design-system";import{jsx as w}from"react/jsx-runtime";/**
 * The Course card wrapper: a pure adapter from Moodle course data to the design system's
 * CourseCard. Used by the My courses MDS cards view (a cookie-switched proof of concept, see
 * GitHub issues #1 and #3).
 *
 * @module     core_course/CourseCard
 * @copyright  2026 Leslie Lee <leslielee888888@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function h({showcoursecategory:e,coursecategory:r,showshortname:n,shortname:o}){if(e)return r;if(n)return o}function C({id:e,fullname:r,shortname:n,viewurl:o,courseimage:a,hasprogress:s,progress:i,visible:u,coursecategory:l,showcoursecategory:d,showshortname:c,strings:t}){const g={"data-region":"course-content","data-course-id":e},b=h({showcoursecategory:d,coursecategory:l,showshortname:c,shortname:n}),m=u?void 0:t.hiddenfromstudents,f=s?t.completepercent:void 0;return w(p,{title:r,subtitle:b,imageSrc:a,imageAlt:"",badgeLabel:m,progressLabel:f,progressValue:s&&i!==null?i:void 0,linkLabel:t.continuelearning,linkHref:o,className:"w-100 h-100",role:"listitem",...g})}export{C as default};
