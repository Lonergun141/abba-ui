/**
 * Single source of truth for the package identity shown across the site.
 *
 * The version is read from the workspace dependency at build time rather than
 * hard-coded, so the docs cannot advertise a version that was never released.
 */
import uiPackage from "@abbainitiative/ui/package.json" with { type: "json" };

export const PACKAGE_NAME = "@abbainitiative/ui";
export const PACKAGE_VERSION: string = uiPackage.version;
export const GITHUB_URL = "https://github.com/Lonergun141/abba-ui";
export const NPM_URL = "https://www.npmjs.com/package/@abbainitiative/ui";
/**
 * Where the docs actually live.
 *
 * `ui.abbainitiative.ph` is the intended home, but it is not attached to the
 * Vercel project yet. Pointing metadata and canonical URLs at a hostname that
 * does not resolve breaks link previews and search indexing, so this tracks
 * reality. Change this one line once the domain and its DNS records exist.
 */
export const DOCS_URL = "https://abba-ui.vercel.app";
