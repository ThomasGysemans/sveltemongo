// A file that runs on at every request

import { error, type Handle } from '@sveltejs/kit';

// This will get executed at every request.
// For example, if the user refreshes the page,
// or if he travels to another page, this will be called.
export const handle = (async ({ event, resolve }) => {
  const userId = event.cookies.get("userId");

  // When the user logs in,
  // what's redirecting him is this function.
  // It detects automatically that the user is now logged in.
  if (event.url.pathname === "/") {
    if (userId != undefined) {
      return new Response(null, { status: 302, headers: { Location: '/projects' } });
      // Normally, we should do this:
      // throw redirect(307, "/projects");
      // But it doesn't work.
      // An error is thrown like if it was a 500 error.
      // It should be fixed in a later version, try it and see it by yourself.
      // If it works, please feel free to fork this project and submit a pull request.
    }
  } else if (event.url.pathname.startsWith('/projects') || event.url.pathname.startsWith('/profile')) {
    if (userId == undefined) {
      throw error(401, "Unauthorized");
    }
  }

  return await resolve(event);
}) satisfies Handle;