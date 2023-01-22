import type { Cookies } from "@sveltejs/kit";

/**
 * Logs out the user.
 * Logging out the user means deleting the cookie holding his user ID.
 * @param cookies The cookies. One must be "userId".
 */
export default function logOutUser(cookies:Cookies) {
  cookies.delete("userId", { path: "/" });
}