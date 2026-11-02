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
 * Test helpers for rendering block_myoverview's MDS cards template with the vendored core/mustache
 * engine (public/lib/amd/src/mustache.js), outside of the full core/templates module.
 *
 * `quoteHelper`, `stringHelper` and `reactHelper` below are ports of the same-named helpers in
 * public/lib/amd/src/local/templates/renderer.js: the control flow and escaping logic is copied
 * as closely as possible, so this test exercises the same behaviour the real renderer would.
 *
 * Two deliberate differences from the original, both because there is no running Moodle (and so
 * no core/str web service call, no Renderer class instance to track state on) in a Jest test:
 *  - `str` resolves synchronously to a deterministic placeholder (see `resolveMockString`)
 *    instead of deferring to an async get_string() call. This is safe for what this test checks:
 *    every hostile character the tests cover (braces, quotes, "&", "<", a backslash) comes from
 *    course data rendered through `quote`, never from a language string rendered through `str`.
 *  - The helpers take `(sectionText, render)` instead of renderer.js's `(context, sectionText,
 *    helper)`; the `context` parameter is only used by the original to track Renderer-instance
 *    state (requiredStrings, disallowed nested helpers) that this port doesn't need.
 *
 * @module     block_myoverview/tests/mustacheTestHelpers
 * @copyright  2026 Leslie Lee <leslielee888888@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/** A Mustache section's raw inner text, rendered against the current context. */
type Render = (template: string) => string;

/** The `(sectionText, render)` shape Moodle's vendored mustache.js calls a section lambda with. */
type SectionLambda = (sectionText: string, render: Render) => string;

/**
 * Moodle's vendored mustache.js (branch LAMBDA_ARGS; see the header comment in mustache.js)
 * auto-invokes a zero-argument function found during context lookup (`Context.prototype.lookup`),
 * then treats a function *result* that is itself a function as the actual Mustache section
 * lambda. core/local/templates/renderer.js's `addHelperFunction` relies on exactly this: `context
 * .quote` is a zero-arg function that returns the real `(sectionText, render) => string` lambda.
 * This wraps a lambda the same way, so `quote`/`str`/`react` behave like the real helpers once
 * placed on a Mustache view object.
 */
function asSectionHelper(lambda: SectionLambda): () => SectionLambda {
  return () => lambda;
}

/**
 * Port of renderer.js's quoteHelper: renders the section's raw content, JSON-encodes it, then
 * shields any run of 2-3 consecutive curly braces behind a Mustache delimiter-change tag so a
 * literal "{{" or "}}" inside the quoted string (e.g. a hostile course name) cannot be misread as
 * a Mustache tag.
 */
function quoteHelper(sectionText: string, render: Render): string {
  let content = render(sectionText.trim());
  content = JSON.stringify(content);
  content = content.replace(/([{}]{2,3})/g, "{{=<% %>=}}$1<%={{ }}=%>");
  return content;
}

/**
 * Deterministic stand-in for a resolved language string; see the module docblock for why `str`
 * resolves synchronously here. Square brackets (not braces) keep the placeholder Mustache-safe
 * wherever it is used outside `quote` (e.g. the "loading" message, which is not JSON-encoded).
 */
function resolveMockString(
  key: string,
  component: string,
  param: string,
): string {
  return `[str:${[key, component, param].filter(Boolean).join(":")}]`;
}

/**
 * Port of renderer.js's stringHelper, resolving synchronously (see the module docblock). Parses
 * "key, component, param" exactly as the original, including rendering the param segment so
 * variable expansion (e.g. `{{#str}}completepercent, block_myoverview, {{progress}}{{/str}}`)
 * still works.
 */
function stringHelper(sectionText: string, render: Render): string {
  const parts = sectionText.split(",");
  const key = parts.length > 0 ? (parts.shift() as string).trim() : "";
  const component = parts.length > 0 ? (parts.shift() as string).trim() : "";
  let param = parts.length > 0 ? parts.join(",").trim() : "";

  if (param !== "") {
    param = render(param);
  }

  return resolveMockString(key, component, param);
}

/** The JSON shape a `{{#react}}...{{/react}}` block's rendered content must parse as. */
interface ReactMountData {
  component?: string;
  props?: unknown;
  [attribute: string]: unknown;
}

/**
 * Port of renderer.js's reactHelper: finds the JSON object embedded in the section's rendered
 * content (scanning backwards from the end for the brace that makes it valid JSON, exactly as the
 * original does), builds a mount element carrying `data-react-component` / `data-react-props`,
 * and keeps any trailing content (the skeleton placeholder markup) as that element's innerHTML.
 */
function reactHelper(sectionText: string, render: Render): string {
  const trimmedContent = render(sectionText);

  const createReactRoot = (content: string): HTMLDivElement => {
    const data = JSON.parse(
      content.trim().replace(/,(\s*[}\]])/g, "$1"),
    ) as ReactMountData;
    const root = document.createElement("div");

    for (const [key, value] of Object.entries(data)) {
      if (value === null || value === "") {
        continue;
      } else if (key === "component") {
        root.setAttribute("data-react-component", String(value));
      } else if (key === "props") {
        root.setAttribute("data-react-props", JSON.stringify(value));
      } else if (typeof value === "boolean") {
        if (value) {
          root.setAttribute(key, "");
        }
      } else if (typeof value === "object") {
        root.setAttribute(key, JSON.stringify(value));
      } else {
        root.setAttribute(key, String(value));
      }
    }

    return root;
  };

  const firstCurlyIndex = trimmedContent.indexOf("{");
  if (firstCurlyIndex === -1) {
    return render(sectionText);
  }

  let lastCurlyIndex = trimmedContent.length;

  do {
    try {
      const contentDiv = createReactRoot(
        trimmedContent.substring(firstCurlyIndex, lastCurlyIndex + 1),
      );
      contentDiv.innerHTML = trimmedContent.substring(lastCurlyIndex + 1);
      return contentDiv.outerHTML;
    } catch (e) {
      // Still not valid JSON. Keep trying.
    }

    lastCurlyIndex = trimmedContent.lastIndexOf("}", lastCurlyIndex - 1);
  } while (lastCurlyIndex > firstCurlyIndex);

  return trimmedContent;
}

/**
 * Builds a Mustache view object wired up with the quote/str/react helper ports, ready to pass to
 * mustache.render alongside the real template context (e.g. `{courses: [...]}`).
 */
export function withRendererHelpers<T extends object>(
  view: T,
): T & Record<string, unknown> {
  return {
    ...view,
    quote: asSectionHelper(quoteHelper),
    str: asSectionHelper(stringHelper),
    react: asSectionHelper(reactHelper),
  };
}

/** One `{{! ... }}` Mustache comment found in a template's source. */
export interface MustacheComment {
  /** 1-based line number where the comment's "{{!" opens. */
  line: number;
  /** The comment's text, excluding the "{{!" / "}}" delimiters. */
  body: string;
}

/**
 * Finds every `{{! ... }}` Mustache comment in `source`, assuming this project's convention that
 * a comment's opening "{{!" is the first non-whitespace content on its line. A comment is taken
 * to close at the first line (from its opening line onwards) whose content, right-trimmed, ends
 * with "}}" - which is also where the real engine's comment token would end, provided (as is true
 * of every comment in these two templates) that no line legitimately needs to end with two braces.
 *
 * This lets `assertCommentsCloseWhereIntended` below catch the historical bug directly: a docblock
 * that mentions a literal "{{#react}}" tag has that tag's own closing braces end mid-line (not at
 * the end of the line), so this scan keeps collecting the docblock's text - including that stray
 * "{{#react}}" - as part of the comment body, right up to the real closing "}}" line. The resulting
 * body then visibly contains a "{{" that should never have been there.
 */
export function findCommentBodies(source: string): MustacheComment[] {
  const lines = source.split("\n");
  const comments: MustacheComment[] = [];

  for (let openLine = 0; openLine < lines.length; openLine++) {
    const openMarker = lines[openLine].indexOf("{{!");
    if (
      openMarker === -1 ||
      lines[openLine].slice(0, openMarker).trim() !== ""
    ) {
      continue;
    }

    const bodyLines: string[] = [];
    let closingLine = -1;

    for (let line = openLine; line < lines.length; line++) {
      const start = line === openLine ? openMarker + "{{!".length : 0;
      const trimmedEnd = lines[line].replace(/\s+$/, "");

      if (trimmedEnd.endsWith("}}") && trimmedEnd.length - 2 >= start) {
        bodyLines.push(lines[line].slice(start, trimmedEnd.length - 2));
        closingLine = line;
        break;
      }

      bodyLines.push(
        line === openLine ? lines[line].slice(start) : lines[line],
      );
    }

    if (closingLine === -1) {
      throw new Error(
        `Unterminated "{{!" comment starting at line ${openLine + 1}.`,
      );
    }

    comments.push({line: openLine + 1, body: bodyLines.join("\n")});
    openLine = closingLine;
  }

  return comments;
}

/**
 * Asserts that no comment found by `findCommentBodies` contains a literal "{{" or "}}" in its
 * body - i.e. that every comment in `source` closes only where its author intended, never early.
 *
 * @throws {Error} naming `label` and the offending comment's line, if any comment fails.
 */
export function assertCommentsCloseWhereIntended(
  source: string,
  label: string,
): void {
  findCommentBodies(source).forEach((comment) => {
    if (comment.body.includes("{{") || comment.body.includes("}}")) {
      throw new Error(
        `${label}: the comment opening at line ${comment.line} contains a literal "{{" or "}}", ` +
          "which would close the Mustache comment early and leak the rest of its text onto the page.",
      );
    }
  });
}
