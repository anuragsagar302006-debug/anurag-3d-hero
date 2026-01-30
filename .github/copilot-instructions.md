# Copilot Instructions for AI Agents

## Project Overview
This is a single-page 3D portfolio site built with vanilla JavaScript, Three.js, and custom CSS. The main goal is to create an interactive, visually rich web experience showcasing the developer's skills in AI, 3D web, and space systems.

## Key Files & Structure
- `index.html`: Entry point. Loads Three.js from CDN, main script, and CSS. Contains overlay UI and a canvas for 3D rendering.
- `main.js`: All 3D scene logic, user interaction (scroll, mouse), and animation. Uses Three.js directly (no frameworks).
- `style.css`: Custom styles for layout, overlays, and 3D canvas. Uses fixed positioning and z-index for layering.

## Architecture & Patterns
- **Single JS file**: All logic is in `main.js`. No modules or build tools.
- **Three.js**: Used for 3D rendering. Scene, camera, and renderer are set up in `main.js`.
- **UI Overlay**: The `#hero` section overlays the 3D canvas for title and subtitle. It is styled to be non-interactive (`pointer-events: none`).
- **Scroll & Mouse Interactions**: Scroll progress and mouse movement are tracked to affect camera and scene for parallax and cinematic effects.
- **No external state management**: All state is managed in local JS variables.

## Developer Workflows
- **No build step**: Open `index.html` directly in a browser. No npm, bundlers, or transpilers.
- **Live reload**: Use browser auto-reload or extensions for rapid iteration.
- **Debugging**: Use browser dev tools. Three.js is loaded via CDN, so breakpoints and console logs work as expected.

## Project-Specific Conventions
- **Sectioned comments**: `main.js` uses clear section headers (e.g., `// ==========================`) to organize logic.
- **ID-based DOM access**: Elements are accessed by `id` (e.g., `#webgl`, `#hero`).
- **No frameworks**: Pure JS and CSS, no React/Vue/Angular.
- **CDN dependencies**: Three.js is loaded from a CDN in `index.html`.

## Integration Points
- **Three.js**: Only external dependency, loaded via CDN.
- **No backend**: All logic is client-side.

## Examples
- To add a new 3D object, extend the scene setup in `main.js`.
- To update the overlay UI, edit the `#hero` section in `index.html` and style in `style.css`.

## Recommendations for AI Agents
- Maintain the single-file JS structure unless refactoring is explicitly requested.
- Use sectioned comments to organize new logic in `main.js`.
- Avoid introducing build tools or frameworks unless specified.
- Reference Three.js documentation for 3D features.

---
For questions about project structure or conventions, review all three main files for context. If adding new features, follow the established patterns for DOM access, event handling, and code organization.
