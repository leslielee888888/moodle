import{createRoot as s}from"react-dom/client";import o from"@moodle/lms/core_course/CourseCardList";import{jsx as d}from"react/jsx-runtime";/**
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
 */const r="mds-course-card-list",i="%PROGRESS%";function u(n){if(!n)return[];try{const e=JSON.parse(n);return Array.isArray(e)?e:[]}catch{return[]}}function l(n,e){return e?n.map(t=>t.completepercent!==void 0||!t.hasprogress||t.progress===null?t:{...t,completepercent:e.replace(i,String(t.progress))}):n}class c extends HTMLElement{#t=null;connectedCallback(){const e=l(u(this.getAttribute("courses")),this.getAttribute("completepercent")),t=document.createElement("div");this.replaceChildren(t),this.#t=s(t),this.#t.render(d(o,{courses:e,strings:{continuelearning:this.getAttribute("continuelearning")??void 0,hiddenfromstudents:this.getAttribute("hiddenfromstudents")??void 0}}))}disconnectedCallback(){this.#t?.unmount(),this.#t=null}}customElements.get(r)||customElements.define(r,c);export{c as CourseCardListElement,i as PROGRESS_PLACEHOLDER,r as TAG_NAME,u as parseCourses};
