import i from"@moodle/lms/core_course/CourseCard";import{jsx as r}from"react/jsx-runtime";/**
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
 */function n({courses:o,strings:e}){return r("div",{className:"card-grid row gx-2 row-cols-1 row-cols-sm-2 row-cols-lg-3","data-region":"card-deck",role:"list",children:o.map(({completepercent:t,...s})=>r("div",{className:"col d-flex mb-2",role:"listitem",children:r(i,{...s,strings:{continuelearning:e.continuelearning,hiddenfromstudents:e.hiddenfromstudents,completepercent:t}})},s.id))})}export{n as default};
