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
 * The Course card wrapper: a pure adapter from Moodle course data to the design system's
 * CourseCard. Used by the My courses MDS cards view (a cookie-switched proof of concept, see
 * GitHub issues #1 and #3).
 *
 * @module     core_course/CourseCard
 * @copyright  2026 Leslie Lee <leslielee888888@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {CourseCard as MdsCourseCard} from "@moodlehq/design-system";

export interface CourseCardProps {
  /** The course id. Used for the `data-course-id` hook on the card root. */
  id: number;
  /** The full, untruncated course name. Rendered as the card's level-3 title. */
  fullname: string;
  /** The course short name. Not yet rendered by this wrapper (reserved for the subtitle). */
  shortname: string;
  /** The URL to view the course. Used as the footer link's destination. */
  viewurl: string;
  /** The course image URL. Moodle always supplies a generated fallback when a course has none. */
  courseimage: string;
  /** Whether the user has progress tracking in this course. Not yet rendered (reserved for the progress bar). */
  hasprogress: boolean;
  /** The course progress percentage (0-100), or null when there is none. Not yet rendered (reserved for the progress bar). */
  progress: number | null;
  /** Whether the course is visible to students. Not yet rendered (reserved for the hidden badge). */
  visible: boolean;
  /** The course's category name. Not yet rendered (reserved for the subtitle). */
  coursecategory: string;
  /** Whether the block is configured to display categories. Not yet rendered (reserved for the subtitle). */
  showcoursecategory: boolean;
  /** Whether the course's short name should be shown. Not yet rendered (reserved for the subtitle). */
  showshortname: boolean;
  /**
   * Translated strings used by the card. A missing string omits the element that needs it
   * rather than throwing, so this prop does not have to carry every key.
   */
  strings: {
    /** The footer link's label, e.g. "Continue learning". Omitted entirely when missing. */
    continuelearning?: string;
  };
}

/**
 * Render a course as an MDS course card.
 *
 * Only the core fields are wired up here: the title, the (decorative) image, the footer link,
 * and the `data-region`/`data-course-id`/`role` hooks the existing JS and Behat tests rely on.
 * Subtitle, the hidden badge and the progress bar are deliberately not implemented yet (left for
 * a later ticket); their raw inputs are still accepted on this interface so it does not change
 * shape again when that work lands.
 *
 * `data-region` and `data-course-id` are not part of the design system's own CourseCard prop
 * types, so they are passed through via a plain object spread rather than as named JSX
 * attributes, which TypeScript would otherwise reject as excess properties.
 *
 * @param props Component props.
 * @returns The rendered MDS course card.
 */
export default function CourseCard({
  id,
  fullname,
  viewurl,
  courseimage,
  strings,
}: CourseCardProps) {
  const hookAttributes: Record<string, unknown> = {
    "data-region": "course-content",
    "data-course-id": id,
  };

  return (
    <MdsCourseCard
      title={fullname}
      imageSrc={courseimage}
      imageAlt=""
      linkLabel={strings.continuelearning}
      linkHref={viewurl}
      role="listitem"
      {...hookAttributes}
    />
  );
}
