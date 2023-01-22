import type { PageServerLoad, Actions } from "./$types";
import { replaceFile, uploadFile } from "$db/gfs";
import { fail } from "@sveltejs/kit";
import getUser from "$db/getUser";

export const load: PageServerLoad = async ({cookies})  =>{
  const { user } = await getUser(cookies);
  return {
    user: {
      picture: user.picture,
      email: user.email
      // ... and some more info about the user.
    },
  }
}

export const actions: Actions = {
  upload: async ({ cookies, request }) => {
    const data = await request.formData();
    const picture = data.get("picture") as Blob;
    // Below are arbitrary values used for the example.
    // It is highly recommended to set those as global variables,
    // and to widen the possibilites.
    const availableTypes = ["image/png", "image/jpeg"];
    const maxSize = 1e6; // 1MB max size here. You are technically not limited to 1MB.
    if (!availableTypes.includes(picture.type)) {
      return fail(400, {
        error: "The image type is not allowed. Must be png or jpg."
      });
    }
    if (picture.size > maxSize) {
      return fail(400, {
        error: "The image is to big. Biggest allowed size is 1MB here."
      });
    }
    try {
      const { user, decipheredUserId, db } = await getUser(cookies);
      const options = { metadata: { uploadedBy: decipheredUserId }};
      let pictureId;
      try {
        // Does the user already have a picture?
        // Depending on your needs, you'll either want to keep the old one or delete it.
        // Here, I'm deleting the old version to save space.
        if (user.picture) {
          pictureId = await replaceFile(user.picture, "picture", picture, db, options);
        } else {
          pictureId = await uploadFile("picture", picture, db, options);
        }
      } catch (e) {
        return fail(400, {
          error: "Could not save the image to the database."
        });
      }
      await db
        .collection("users")
        .updateOne({ email: user.email }, { $set: { picture: pictureId } });
    } catch (e) {
      console.error(e);
      return fail(400, {
        error: "Could not save the picture to the database."
      });
    }
  },
};