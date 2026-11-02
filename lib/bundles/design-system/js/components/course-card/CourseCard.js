import { Avatar } from "../avatar/Avatar.js";
import { Badge } from "../badge/Badge.js";
import { Link } from "../link/Link.js";
import { ProgressBar } from "../progress-bar/ProgressBar.js";
import { forwardRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region components/course-card/CourseCard.tsx
var allowedHeadingLevels = [
	2,
	3,
	4,
	5,
	6
];
var CourseCard = forwardRef(function CourseCard({ title, headingLevel = 3, subtitle, imageSrc, imageAlt = "", badgeLabel, teacherName, teacherImageSrc, progressLabel, progressValue = 0, progressMax = 100, linkLabel, linkHref, className, ...props }, ref) {
	const Heading = `h${allowedHeadingLevels.includes(headingLevel) ? headingLevel : 3}`;
	const classes = ["mds-course-card"];
	if (className) classes.push(className);
	return /* @__PURE__ */ jsxs("article", {
		ref,
		className: classes.join(" "),
		...props,
		children: [imageSrc && /* @__PURE__ */ jsx("div", {
			className: "mds-course-card-image",
			children: /* @__PURE__ */ jsx("img", {
				className: "mds-course-card-image-img",
				src: imageSrc,
				alt: imageAlt,
				loading: "lazy"
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "mds-course-card-content",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "mds-course-card-header",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "mds-course-card-text",
						children: [/* @__PURE__ */ jsx(Heading, {
							className: "mds-course-card-title",
							children: title
						}), subtitle && /* @__PURE__ */ jsx("p", {
							className: "mds-course-card-subtitle",
							children: subtitle
						})]
					}), badgeLabel && /* @__PURE__ */ jsx(Badge, {
						label: badgeLabel,
						variant: "secondary",
						subtle: true
					})]
				}),
				teacherName && /* @__PURE__ */ jsxs("div", {
					className: "mds-course-card-teacher",
					children: [/* @__PURE__ */ jsx(Avatar, {
						size: "sm",
						imageSrc: teacherImageSrc,
						alt: teacherName
					}), /* @__PURE__ */ jsx("span", {
						className: "mds-course-card-teacher-name",
						children: teacherName
					})]
				}),
				progressLabel && /* @__PURE__ */ jsx(ProgressBar, {
					labelVariant: "title",
					title: progressLabel,
					value: progressValue,
					max: progressMax
				}),
				linkLabel && linkHref && /* @__PURE__ */ jsx(Link, {
					label: linkLabel,
					href: linkHref,
					variant: "primary",
					endIcon: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-arrow-right" })
				})
			]
		})]
	});
});
CourseCard.displayName = "CourseCard";
//#endregion
export { CourseCard };

//# sourceMappingURL=CourseCard.js.map