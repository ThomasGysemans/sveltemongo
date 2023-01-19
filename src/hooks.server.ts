// A file that runs on at every request

import { error, redirect, type Handle } from '@sveltejs/kit';

// This will get executed at every request.
// For example, if the user refreshes the page,
// or if he travels to another page, this will be called.
export const handle = (async ({ event, resolve }) => {
  const userId = event.cookies.get("userId");

  if (event.url.pathname === "/") {
    if (userId != undefined) {
      throw redirect(307, "/projects");
    }
  } else if (event.url.pathname.startsWith('/projects')) {
    if (userId == undefined) {
      throw error(401, "Unauthorized");
    }
  }

  return await resolve(event);
}) satisfies Handle;