# Moodle LMS

The Moodle learning management system. This glossary covers the vocabulary used while moving the dashboard onto the Moodle Design System (MDS).

## Language

**My courses**:
The dashboard block (`block_myoverview`) that lists the courses a user is enrolled in, in card, list or summary views.
_Avoid_: My overview, course overview, dashboard courses

**Course card**:
The existing Moodle presentation of one course in the My courses cards view, with an action menu, a favourite star and a progress footer.
_Avoid_: Legacy card, old card

**MDS course card**:
The Moodle Design System `CourseCard` component, with a different layout from the Course card: image, title, subtitle, badge, progress bar and a footer link.
_Avoid_: New card, design system card

**Course card wrapper**:
The Moodle-side adapter that accepts Moodle course data and presents it as an MDS course card.
_Avoid_: Adapter, mapper

**Course card list element**:
The opt-in custom element that shows the MDS course cards for My courses as one grid, instead of the cards being mounted by the React template helper.
_Avoid_: Web component, card grid element

**Course card skeleton**:
The placeholder shown in place of an MDS course card until it is ready, matching its size and layout.
_Avoid_: Loader, spinner, fallback card
