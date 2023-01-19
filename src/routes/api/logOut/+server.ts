import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const DELETE = (({ cookies }) => {
  const userId = cookies.get("userId");
  if (userId == undefined) {
    throw error(401, "You are not connected.");
  }
  cookies.delete("userId", {path:"/"});
  return new Response("Logged out successfully", { status: 200 });
}) satisfies RequestHandler;