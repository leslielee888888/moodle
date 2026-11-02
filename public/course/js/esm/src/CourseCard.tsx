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

import { CourseCard as MdsCourseCard } from "@moodlehq/design-system";

export interface CourseCardProps {
  /** The course id. Used for the `data-course-id` hook on the card root. */
  id: number;
  /** The full, untruncated course name. Rendered as the card's level-3 title. */
  fullname: string;
  /** The course short name. Used as the subtitle when short names are shown and categories are not. */
  shortname: string;
  /** The URL to view the course. Used as the footer link's destination. */
  viewurl: string;
  /** The course image URL. Moodle always supplies a generated fallback when a course has none. */
  courseimage: string;
  /** Whether the user has progress tracking in this course. Gates the progress bar. */
  hasprogress: boolean;
  /** The course progress percentage (0-100), or null when there is none. */
  progress: number | null;
  /** Whether the course is visible to students. When false, shows the hidden badge. */
  visible: boolean;
  /** The course's category name. Used as the subtitle when categories are shown. */
  coursecategory: string;
  /** Whether the block is configured to display categories. Takes precedence over `showshortname` for the subtitle. */
  showcoursecategory: boolean;
  /** Whether the course's short name should be shown. Only used for the subtitle when categories are not shown. */
  showshortname: boolean;
  /**
   * Translated strings used by the card. A missing string omits the element that needs it
   * rather than throwing, so this prop does not have to carry every key.
   */
  strings: {
    /** The footer link's label, e.g. "Continue learning". Omitted entirely when missing. */
    continuelearning?: string;
    /** The hidden-course badge's label, e.g. "Hidden from students" (core string `hiddenfromstudents`). */
    hiddenfromstudents?: string;
    /**
     * The progress label, e.g. "40% complete" (block_myoverview string `completepercent`),
     * pre-filled with the course's progress.
     */
    completepercent?: string;
  };
}

/**
 * The subtitle shown beneath the title: the category when categories are shown, otherwise the
 * short name when short names are shown, otherwise none.
 *
 * @param props Subset of CourseCardProps needed to resolve the subtitle.
 * @returns The subtitle text, or undefined when neither applies.
 */
function getSubtitle({
  showcoursecategory,
  coursecategory,
  showshortname,
  shortname,
}: Pick<
  CourseCardProps,
  "showcoursecategory" | "coursecategory" | "showshortname" | "shortname"
>): string | undefined {
  if (showcoursecategory) {
    return coursecategory;
  }
  if (showshortname) {
    return shortname;
  }
  return undefined;
}

/**
 * Render a course as an MDS course card.
 *
 * Wires up the title, subtitle, hidden badge, progress bar, the (decorative) image, the footer
 * link, and the `data-region`/`data-course-id`/`role` hooks the existing JS and Behat tests rely
 * on. The action menu and favourite star are intentionally omitted (out of scope; see issue #1).
 *
 * Each of the subtitle, badge and progress bar is driven by a translated string: when that
 * string is missing from `strings`, the corresponding prop on the design-system card resolves to
 * `undefined` and the card omits the element rather than throwing.
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
  shortname,
  viewurl,
  courseimage,
  hasprogress,
  progress,
  visible,
  coursecategory,
  showcoursecategory,
  showshortname,
  strings,
}: CourseCardProps) {
  const hookAttributes: Record<string, unknown> = {
    "data-region": "course-content",
    "data-course-id": id,
  };

  const subtitle = getSubtitle({
    showcoursecategory,
    coursecategory,
    showshortname,
    shortname,
  });
  const badgeLabel = !visible ? strings.hiddenfromstudents : undefined;
  const progressLabel = hasprogress ? strings.completepercent : undefined;
  const progressValue = hasprogress && progress !== null ? progress : undefined;

  return (
    <MdsCourseCard
      title={fullname}
      subtitle={subtitle}
      imageSrc={courseimage}
      imageAlt=""
      badgeLabel={badgeLabel}
      progressLabel={progressLabel}
      progressValue={progressValue}
      linkLabel={strings.continuelearning}
      linkHref={viewurl}
      className="w-100 h-100"
      role="listitem"
      {...hookAttributes}
    />
  );
}
