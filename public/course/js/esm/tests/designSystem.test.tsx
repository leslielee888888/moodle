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
 * Smoke test guarding Jest's ability to import and render the real, ESM-only
 * `@moodlehq/design-system` package (as opposed to mocking it, like the Course card
 * wrapper's own tests do). See GitHub issue #9 (parent #1).
 *
 * This test deliberately imports the package directly rather than going through the
 * Course card wrapper, so a future change to the jest.config.js workaround is caught
 * here even if every wrapper test keeps mocking the package.
 *
 * @module     core_course/tests/designSystem
 * @copyright  2026 Leslie Lee <leslielee888888@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {render, screen} from "@testing-library/react";
import {Badge, CourseCard} from "@moodlehq/design-system";

describe("@moodlehq/design-system (real package, unmocked)", () => {
  it("renders a CourseCard with its title as a heading", () => {
    render(<CourseCard title="Introduction to Testing" />);
    expect(
      screen.getByRole("heading", {name: "Introduction to Testing"}),
    ).toBeInTheDocument();
  });

  it("renders a Badge with its label", () => {
    render(<Badge label="Hidden from students" />);
    expect(screen.getByText("Hidden from students")).toBeInTheDocument();
  });
});
