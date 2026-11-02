import{useEffect as T,useRef as x}from"react";import{CourseCard as A}from"@moodlehq/design-system";import{jsx as M}from"react/jsx-runtime";/**
 * The Course card wrapper: a pure adapter from Moodle course data to the design system's
 * CourseCard. Used by the My courses MDS cards view (a cookie-switched proof of concept, see
 * GitHub issues #1 and #3).
 *
 * @module     core_course/CourseCard
 * @copyright  2026 Leslie Lee <leslielee888888@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function n(e){if(e!==void 0)return new DOMParser().parseFromString(e,"text/html").body.textContent??""}function P({showcoursecategory:e,coursecategory:s,showshortname:i,shortname:t}){if(e)return s;if(i)return t}function S({id:e,fullname:s,shortname:i,viewurl:t,courseimage:d,hasprogress:c,progress:g,visible:f,coursecategory:h,showcoursecategory:m,showshortname:b,strings:a}){const p={"data-region":"course-content","data-course-id":e},r=n(s),w=n(i),C=n(h),L=P({showcoursecategory:m,coursecategory:C,showshortname:b,shortname:w}),k=f?void 0:n(a.hiddenfromstudents),v=c?n(a.completepercent):void 0,y=g??void 0,o=n(a.continuelearning),l=x(null);return T(()=>{const u=l.current?.querySelector("a.mds-link");if(!(!u||!o))return u.setAttribute("aria-label",`${o}: ${r}`),()=>u.removeAttribute("aria-label")},[o,r,t]),M(A,{ref:l,"aria-label":r,title:r,headingLevel:3,subtitle:L,imageSrc:d,imageAlt:"",badgeLabel:k,progressLabel:v,progressValue:y,linkLabel:o,linkHref:t,className:"w-100 h-100",...p})}export{S as default};
