import type { RequestHandler } from "./$types";
import { error } from "@sveltejs/kit";

// An HTTP request to log out the user.
// This is using `DELETE` HTTP verb because
// logging out the user means deleting the "userId" cookie.
// Using another verb may not work.
export const DELETE = (({ cookies }) => {
  const userId = cookies.get("userId");
  if (userId == undefined) {
    throw error(401, "You are not connected.");
  }
  cookies.delete("userId", {path:"/"});
  return new Response("Logged out successfully", { status: 200 });
}) satisfies RequestHandler;