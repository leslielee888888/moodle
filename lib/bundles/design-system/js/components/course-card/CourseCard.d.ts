import { HTMLAttributes } from 'react';
type CourseCardHeadingLevel = 2 | 3 | 4 | 5 | 6;
export interface CourseCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
    /** Course name. Must be a caller-supplied translated string. */
    title: string;
    /** Heading level for the title (2–6). Defaults to 3. */
    headingLevel?: CourseCardHeadingLevel;
    /** Secondary text beneath the title, e.g. the course category. */
    subtitle?: string;
    /** Course image URL. The image block is omitted when not provided. */
    imageSrc?: string;
    /** Alt text for the course image. Leave empty when the image is decorative. */
    imageAlt?: string;
    /** Optional badge text shown beneath the title block. */
    badgeLabel?: string;
    /** Optional teacher name. Renders the teacher row when provided. */
    teacherName?: string;
    /** Teacher photo URL for the avatar. */
    teacherImageSrc?: string;
    /** Pre-translated progress text, e.g. "Lesson 7 of 16". Renders the progress bar when provided. */
    progressLabel?: string;
    /** Current progress value. Defaults to 0. */
    progressValue?: number;
    /** Maximum progress value. Defaults to 100. */
    progressMax?: number;
    /** Footer link text, e.g. "Continue learning". Renders the link when provided with `linkHref`. */
    linkLabel?: string;
    /** Footer link destination. */
    linkHref?: string;
}
export declare const CourseCard: import('react').ForwardRefExoticComponent<CourseCardProps & import('react').RefAttributes<HTMLElement>>;
export {};
