import { protect } from "./auth.js";

/**
 * Backward-compatible alias for authentication route protection.
 */
export const protectRoute = protect;
export default protect;