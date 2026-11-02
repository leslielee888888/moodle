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
 * Jest tests for the Course card list.
 *
 * Renders the real, unmocked Course card wrapper (and through it, the real
 * `@moodlehq/design-system` CourseCard) for every course, the same way the Course card wrapper's
 * own tests do (see GitHub issue #9, parent #1), and asserts on what a user (or assistive
 * technology) sees - roles, text and attributes - rather than on internal structure.
 *
 * @module     core_course/tests/CourseCardList
 * @copyright  2026 Leslie Lee <leslielee888888@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import { render, screen } from "@testing-library/react";
import CourseCardList, {
  CourseCardListProps,
  CourseListItem,
} from "../src/CourseCardList";

/**
 * Build one course list item, overriding only what a test cares about.
 *
 * @param overrides Partial fields to override the defaults.
 * @returns A complete CourseListItem.
 */
function buildCourse(overrides: Partial<CourseListItem> = {}): CourseListItem {
  return {
    id: 42,
    fullname: "Introduction to Testing",
    shortname: "TEST101",
    viewurl: "https://example.com/course/view.php?id=42",
    courseimage: "https://example.com/course/image.php?id=42",
    hasprogress: true,
    progress: 45,
    visible: true,
    coursecategory: "Computer Science",
    showcoursecategory: false,
    showshortname: false,
    completepercent: "45% complete",
    ...overrides,
  };
}

/**
 * Build props for the Course card list, overriding only what a test cares about.
 *
 * @param overrides Partial props to override the defaults.
 * @returns Complete CourseCardListProps.
 */
function buildProps(
  overrides: Partial<CourseCardListProps> = {},
): CourseCardListProps {
  return {
    courses: [buildCourse()],
    strings: {
      continuelearning: "Continue learning",
      hiddenfromstudents: "Hidden from students",
    },
    ...overrides,
  };
}

describe("CourseCardList (Course card list)", () => {
  it("renders the list container with the card-deck region and list role", () => {
    render(<CourseCardList {...buildProps()} />);
    const list = screen.getByRole("list");
    expect(list).toHaveAttribute("data-region", "card-deck");
  });

  it("renders exactly one card per course", () => {
    render(
      <CourseCardList
        {...buildProps({
          courses: [
            buildCourse({ id: 1, fullname: "Biology" }),
            buildCourse({ id: 2, fullname: "Chemistry" }),
            buildCourse({ id: 3, fullname: "Physics" }),
          ],
        })}
      />,
    );
    expect(screen.getAllByRole("article")).toHaveLength(3);
    expect(
      screen.getByRole("heading", { level: 3, name: "Biology" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Chemistry" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Physics" }),
    ).toBeInTheDocument();
  });

  it("gives each cell the list-item role, as a direct wrapper around each card", () => {
    render(
      <CourseCardList
        {...buildProps({
          courses: [buildCourse({ id: 1 }), buildCourse({ id: 2 })],
        })}
      />,
    );
    const cells = screen.getAllByRole("listitem");
    expect(cells).toHaveLength(2);
    cells.forEach((cell) => {
      expect(
        cell.querySelector('[data-region="course-content"]'),
      ).not.toBeNull();
    });
  });

  it("sets data-course-id on each card, matching its own course", () => {
    render(
      <CourseCardList
        {...buildProps({
          courses: [buildCourse({ id: 7 }), buildCourse({ id: 9 })],
        })}
      />,
    );
    const cards = screen.getAllByRole("article");
    expect(cards.map((card) => card.getAttribute("data-course-id"))).toEqual([
      "7",
      "9",
    ]);
  });

  it("shows the hidden badge only on courses that are not visible", () => {
    render(
      <CourseCardList
        {...buildProps({
          courses: [
            buildCourse({ id: 1, fullname: "Visible course", visible: true }),
            buildCourse({ id: 2, fullname: "Hidden course", visible: false }),
          ],
        })}
      />,
    );
    expect(screen.getAllByText("Hidden from students")).toHaveLength(1);
  });

  it("shows the progress bar and per-course percentage only when the course has progress tracking", () => {
    render(
      <CourseCardList
        {...buildProps({
          courses: [
            buildCourse({
              id: 1,
              fullname: "Tracked course",
              hasprogress: true,
              progress: 45,
              completepercent: "45% complete",
            }),
            buildCourse({
              id: 2,
              fullname: "Untracked course",
              hasprogress: false,
              progress: null,
              completepercent: undefined,
            }),
          ],
        })}
      />,
    );
    expect(screen.getAllByRole("progressbar")).toHaveLength(1);
    expect(screen.getByText("45% complete")).toBeInTheDocument();
  });

  it("uses the shared 'Continue learning' string for every card's footer link, suffixed with its own title", () => {
    render(
      <CourseCardList
        {...buildProps({
          courses: [
            buildCourse({ id: 1, fullname: "Biology" }),
            buildCourse({ id: 2, fullname: "Chemistry" }),
          ],
          strings: { continuelearning: "Continue learning" },
        })}
      />,
    );
    expect(
      screen.getByRole("link", { name: "Continue learning: Biology" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Continue learning: Chemistry" }),
    ).toBeInTheDocument();
  });

  it("renders an empty list (no cells) when there are no courses, without throwing", () => {
    expect(() =>
      render(<CourseCardList {...buildProps({ courses: [] })} />),
    ).not.toThrow();
    const list = screen.getByRole("list");
    expect(list).toHaveAttribute("data-region", "card-deck");
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    expect(screen.queryAllByRole("article")).toHaveLength(0);
  });

  it("does not throw and omits the hidden badge and link when shared strings are missing", () => {
    expect(() =>
      render(
        <CourseCardList
          {...buildProps({
            courses: [buildCourse({ visible: false })],
            strings: {},
          })}
        />,
      ),
    ).not.toThrow();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
