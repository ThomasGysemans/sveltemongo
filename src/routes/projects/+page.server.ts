import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { decipherUserId } from "$db/security";
import clientPromise from "$db/mongo";
import { ObjectID } from "bson";
import ip from "ip";

export const load: PageServerLoad = async ({ cookies }) => {
  const userId = cookies.get('userId');
  if (!userId) {
    throw error(401, "Unauthorized");
  }
  const decipheredUserId = decipherUserId(userId, ip.address());
  const client = await clientPromise;
  const db = client.db("myFirstDatabase");
  const user = await db
    .collection<User>("users")
    .findOne({ _id: new ObjectID(decipheredUserId) });
  // This verification needs to be added every time we fetch the user's data
  // because it could be removed from the database in between.
  // This happens when the user deletes his account on another session for example.
  if (user == null) {
    cookies.delete("userId", { path:"/" });
    throw error(400, "Bad request or the user doesn't exist.");
  }
  const data = await db
    .collection<Project>("projects")
    .find({})
    .toArray();
  return {
    projects: data.map(v => ({ ...v, _id: v._id.toString() })),
    user: {
      email: user!.email
    },
  }
};