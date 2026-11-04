# The Course card list element takes its courses as a JSON attribute

The Course card list element receives every course in one `courses` attribute holding a JSON array, with the shared strings as separate attributes. We chose this over data-only child elements, a `<script type="application/json">` child, and a `{{#js}}` block that sets a property, because it keeps the template free of inline JavaScript and of `{{#react}}` / `{{#reactprop}}`, and lets the one element read all its data at once when it connects.

## Considered Options

- **Data-only child elements**: rejected, because the element would have to wait for its children to be parsed before it could render.
- **A JSON script child**: rejected, because the JSON would sit in the template as a block of its own, with a comma flag and manual escaping.
- **A `{{#js}}` block setting a property**: rejected, because it puts inline JavaScript in the template.

## Consequences

Moodle's Mustache has no JSON helper, so the array is still built by hand in the template. Because the `quote` helper does not escape the single quote, the attribute is single-quoted and every value inside it uses double braces, which HTML-escape the single quote, the double quote and the ampersand. Keep both when editing the template. The progress label is one shared `completepercent` attribute containing `%PROGRESS%`, because a language string with an apostrophe would otherwise end the attribute early.
