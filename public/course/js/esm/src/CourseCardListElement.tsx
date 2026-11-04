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
 */

import { createRoot, Root } from "react-dom/client";
import CourseCardList, {
  CourseListItem,
} from "@moodle/lms/core_course/CourseCardList";

/** The custom element's tag name. */
export const TAG_NAME = "mds-course-card-list";

/** The placeholder in the `completepercent` attribute that is replaced by a course's progress. */
export const PROGRESS_PLACEHOLDER = "%PROGRESS%";

/**
 * Parse the `courses` attribute.
 *
 * @param raw The attribute value, or null when it is absent.
 * @returns The courses, or an empty array when the value is absent, is not valid JSON, or is not an array.
 */
export function parseCourses(raw: string | null): CourseListItem[] {
  if (!raw) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CourseListItem[]) : [];
  } catch {
    return [];
  }
}

/**
 * Fill each course's progress label from the shared template, where it has progress and no label
 * of its own.
 *
 * @param courses The parsed courses.
 * @param template The shared `completepercent` template, or null when absent.
 * @returns The courses with their progress labels filled in.
 */
function withProgressLabels(
  courses: CourseListItem[],
  template: string | null,
): CourseListItem[] {
  if (!template) {
    return courses;
  }
  return courses.map((course) =>
    course.completepercent !== undefined ||
    !course.hasprogress ||
    course.progress === null
      ? course
      : {
          ...course,
          completepercent: template.replace(
            PROGRESS_PLACEHOLDER,
            String(course.progress),
          ),
        },
  );
}

/** The `<mds-course-card-list>` custom element. */
export class CourseCardListElement extends HTMLElement {
  #root: Root | null = null;

  connectedCallback(): void {
    const courses = withProgressLabels(
      parseCourses(this.getAttribute("courses")),
      this.getAttribute("completepercent"),
    );

    // Replace the skeleton fallback content with the React root's container.
    const container = document.createElement("div");
    this.replaceChildren(container);

    this.#root = createRoot(container);
    this.#root.render(
      <CourseCardList
        courses={courses}
        strings={{
          continuelearning: this.getAttribute("continuelearning") ?? undefined,
          hiddenfromstudents:
            this.getAttribute("hiddenfromstudents") ?? undefined,
        }}
      />,
    );
  }

  disconnectedCallback(): void {
    this.#root?.unmount();
    this.#root = null;
  }
}

if (!customElements.get(TAG_NAME)) {
  customElements.define(TAG_NAME, CourseCardListElement);
}
