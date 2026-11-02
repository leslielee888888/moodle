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
 * Jest tests for the Course card wrapper.
 *
 * Renders the real, unmocked `@moodlehq/design-system` CourseCard (see GitHub issue #9,
 * parent #1) and asserts on what a user (or assistive technology) sees — roles, text and
 * attributes — rather than on internal structure.
 *
 * @module     core_course/tests/CourseCard
 * @copyright  2026 Leslie Lee <leslielee888888@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {render, screen} from "@testing-library/react";
import CourseCard, {CourseCardProps} from "../src/CourseCard";

/**
 * Build props for the Course card wrapper, overriding only what a test cares about.
 *
 * @param overrides Partial props to override the defaults.
 * @returns Complete CourseCardProps.
 */
function buildProps(overrides: Partial<CourseCardProps> = {}): CourseCardProps {
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
    strings: {
      continuelearning: "Continue learning",
      hiddenfromstudents: "Hidden from students",
      completepercent: "45% complete",
    },
    ...overrides,
  };
}

describe("CourseCard (Course card wrapper)", () => {
  it("renders the full name as a level-3 heading, decoding HTML entities and stripping tags", () => {
    render(
      <CourseCard
        {...buildProps({fullname: "Intro to <b>Testing</b> &amp; Design"})}
      />,
    );
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Intro to Testing & Design",
      }),
    ).toBeInTheDocument();
  });

  it("shows the category as the subtitle, decoded to plain text, when categories are shown", () => {
    render(
      <CourseCard
        {...buildProps({
          showcoursecategory: true,
          showshortname: true, // Category takes precedence even when short names are also enabled.
          coursecategory: "Computer &amp; Information <i>Science</i>",
          shortname: "SHOULD-NOT-APPEAR",
        })}
      />,
    );
    expect(
      screen.getByText("Computer & Information Science"),
    ).toBeInTheDocument();
    expect(screen.queryByText("SHOULD-NOT-APPEAR")).not.toBeInTheDocument();
  });

  it("shows the short name as the subtitle, decoded to plain text, when categories are hidden", () => {
    render(
      <CourseCard
        {...buildProps({
          showcoursecategory: false,
          showshortname: true,
          shortname: "CS &amp; <b>AI</b> 101",
        })}
      />,
    );
    expect(screen.getByText("CS & AI 101")).toBeInTheDocument();
  });

  it("shows no subtitle when neither categories nor short names are shown", () => {
    render(
      <CourseCard
        {...buildProps({
          showcoursecategory: false,
          showshortname: false,
          coursecategory: "Computer Science",
          shortname: "TEST101",
        })}
      />,
    );
    expect(screen.queryByText("Computer Science")).not.toBeInTheDocument();
    expect(screen.queryByText("TEST101")).not.toBeInTheDocument();
  });

  it("shows the 'Hidden from students' badge, decoded to plain text, when the course is not visible", () => {
    render(
      <CourseCard
        {...buildProps({
          visible: false,
          strings: {hiddenfromstudents: "Hidden &amp; <b>not visible</b>"},
        })}
      />,
    );
    expect(screen.getByText("Hidden & not visible")).toBeInTheDocument();
  });

  it("shows no hidden badge when the course is visible", () => {
    render(
      <CourseCard
        {...buildProps({
          visible: true,
          strings: {hiddenfromstudents: "Hidden from students"},
        })}
      />,
    );
    expect(screen.queryByText("Hidden from students")).not.toBeInTheDocument();
  });

  it("shows the progress bar and the '{n}% complete' label when the course has progress", () => {
    render(
      <CourseCard
        {...buildProps({
          hasprogress: true,
          progress: 45,
          strings: {completepercent: "45% complete"},
        })}
      />,
    );
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByText("45% complete")).toBeInTheDocument();
  });

  it("shows the progress bar when progress is empty (null), as long as the course has progress tracking", () => {
    render(
      <CourseCard
        {...buildProps({
          hasprogress: true,
          progress: null,
          strings: {completepercent: "0% complete"},
        })}
      />,
    );
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByText("0% complete")).toBeInTheDocument();
  });

  it("shows no progress bar or label when the course has no progress tracking", () => {
    render(
      <CourseCard
        {...buildProps({
          hasprogress: false,
          progress: null,
          strings: {completepercent: "45% complete"},
        })}
      />,
    );
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(screen.queryByText("45% complete")).not.toBeInTheDocument();
  });

  it("shows a 'Continue learning' link pointing at the course view URL", () => {
    render(
      <CourseCard
        {...buildProps({
          viewurl: "https://example.com/course/view.php?id=99",
          strings: {continuelearning: "Continue learning"},
        })}
      />,
    );
    const link = screen.getByRole("link", {name: "Continue learning"});
    expect(link).toHaveAttribute(
      "href",
      "https://example.com/course/view.php?id=99",
    );
  });

  it("renders the course image with empty alt text", () => {
    const {container} = render(
      <CourseCard
        {...buildProps({
          courseimage: "https://example.com/course/image.php?id=42",
        })}
      />,
    );
    // An <img> with alt="" is decorative and intentionally excluded from the accessibility
    // tree (implicit role="presentation"), so it is not reachable via getByRole("img"); query
    // the element directly to assert on its (still user/assistive-tech-facing) attributes.
    const image = container.querySelector("img");
    expect(image).toHaveAttribute(
      "src",
      "https://example.com/course/image.php?id=42",
    );
    expect(image).toHaveAttribute("alt", "");
  });

  // NOTE: an upcoming change may move `role="listitem"` from the card root to a grid-cell
  // wrapper around it. Keep this assertion isolated in this one test so it is trivial to
  // update in isolation when that happens.
  it("sets data-region, data-course-id and the list-item role on the card root", () => {
    render(<CourseCard {...buildProps({id: 123})} />);
    const card = screen.getByRole("listitem");
    expect(card).toHaveAttribute("data-region", "course-content");
    expect(card).toHaveAttribute("data-course-id", "123");
  });

  it("omits elements for missing strings instead of throwing", () => {
    expect(() =>
      render(
        <CourseCard
          {...buildProps({
            visible: false,
            hasprogress: true,
            progress: 45,
            strings: {},
          })}
        />,
      ),
    ).not.toThrow();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
