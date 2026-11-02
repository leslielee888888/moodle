import{CourseCard as v}from"@moodlehq/design-system";import{jsx as T}from"react/jsx-runtime";/**
 * The Course card wrapper: a pure adapter from Moodle course data to the design system's
 * CourseCard. Used by the My courses MDS cards view (a cookie-switched proof of concept, see
 * GitHub issues #1 and #3).
 *
 * @module     core_course/CourseCard
 * @copyright  2026 Leslie Lee <leslielee888888@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function n(e){if(e!==void 0)return new DOMParser().parseFromString(e,"text/html").body.textContent??""}function x({showcoursecategory:e,coursecategory:t,showshortname:r,shortname:o}){if(e)return t;if(r)return o}function y({id:e,fullname:t,shortname:r,viewurl:o,courseimage:i,hasprogress:a,progress:u,visible:d,coursecategory:l,showcoursecategory:c,showshortname:g,strings:s}){const h={"data-region":"course-content","data-course-id":e},m=n(t),f=n(r),p=n(l),b=x({showcoursecategory:c,coursecategory:p,showshortname:g,shortname:f}),w=d?void 0:n(s.hiddenfromstudents),C=a?n(s.completepercent):void 0;return T(v,{title:m,headingLevel:3,subtitle:b,imageSrc:i,imageAlt:"",badgeLabel:w,progressLabel:C,progressValue:u??void 0,linkLabel:n(s.continuelearning),linkHref:o,className:"w-100 h-100",role:"listitem",...h})}export{y as default};
