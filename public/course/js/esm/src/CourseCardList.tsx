// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
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
 */

import CourseCard, {
  CourseCardProps,
} from "@moodle/lms/core_course/CourseCard";

/**
 * One course's data, as the Course card wrapper needs it, plus its own pre-filled progress
 * string. `continuelearning` and `hiddenfromstudents` are not part of this shape: they are shared
 * by every card and come from {@link CourseCardListProps.strings} instead.
 */
export type CourseListItem = Omit<CourseCardProps, "strings"> & {
  /**
   * The progress label, e.g. "40% complete" (block_myoverview string `completepercent`),
   * pre-filled with this course's own progress. Omitted when the course has no progress
   * tracking, per the "missing string" contract on {@link CourseCardProps.strings}.
   */
  completepercent?: string;
};

export interface CourseCardListProps {
  /** Every course to render, in display order. */
  courses: CourseListItem[];
  /**
   * Strings shared by every card. A missing string omits the element that needs it rather than
   * throwing, the same "missing string" contract as {@link CourseCardProps.strings}.
   */
  strings: {
    /** The footer link's label, e.g. "Continue learning". Shared by every card. */
    continuelearning?: string;
    /** The hidden-course badge's label, e.g. "Hidden from students". Shared by every card. */
    hiddenfromstudents?: string;
  };
}

/**
 * Render the whole My courses cards grid as one React root.
 *
 * The grid container carries the `card-deck` region hook and the list role; each cell carries
 * the list-item role (an `article`, which the Course card wrapper renders, cannot take that role
 * itself - see GitHub issue #13's fix, commit f3c97145be7). Each cell wraps one, unmodified
 * Course card wrapper.
 *
 * @param props Component props.
 * @returns The rendered course grid.
 */
export default function CourseCardList({
  courses,
  strings,
}: CourseCardListProps) {
  return (
    <div
      className="card-grid row gx-2 row-cols-1 row-cols-sm-2 row-cols-lg-3"
      data-region="card-deck"
      role="list"
    >
      {courses.map(({ completepercent, ...course }) => (
        <div key={course.id} className="col d-flex mb-2" role="listitem">
          <CourseCard
            {...course}
            strings={{
              continuelearning: strings.continuelearning,
              hiddenfromstudents: strings.hiddenfromstudents,
              completepercent,
            }}
          />
        </div>
      ))}
    </div>
  );
}
