import{CourseCard as p}from"@moodlehq/design-system";import{jsx as w}from"react/jsx-runtime";/**
 * The Course card wrapper: a pure adapter from Moodle course data to the design system's
 * CourseCard. Used by the My courses MDS cards view (a cookie-switched proof of concept, see
 * GitHub issues #1 and #3).
 *
 * @module     core_course/CourseCard
 * @copyright  2026 Leslie Lee <leslielee888888@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function C({showcoursecategory:e,coursecategory:r,showshortname:n,shortname:o}){if(e)return r;if(n)return o}function h({id:e,fullname:r,shortname:n,viewurl:o,courseimage:u,hasprogress:s,progress:i,visible:a,coursecategory:l,showcoursecategory:d,showshortname:c,strings:t}){const g={"data-region":"course-content","data-course-id":e},b=C({showcoursecategory:d,coursecategory:l,showshortname:c,shortname:n}),f=a?void 0:t.hiddenfromstudents,m=s?t.completepercent:void 0;return w(p,{title:r,subtitle:b,imageSrc:u,imageAlt:"",badgeLabel:f,progressLabel:m,progressValue:s&&i!==null?i:void 0,linkLabel:t.continuelearning,linkHref:o,role:"listitem",...g})}export{h as default};
