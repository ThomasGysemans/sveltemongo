import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { decipherUserId } from "$db/security";
import clientPromise from "$db/mongo";
import ip from "ip";
import { ObjectID } from "bson";

export const load: PageServerLoad = async ({ cookies }) => {
  const userId = cookies.get('userId');
  if (!userId) {
    throw error(401, "Unauthorized");
  }
  const decipheredUserId = decipherUserId(userId, ip.address());
  const client = await clientPromise;
  const db = client.db("myFirstDatabase");
  const data = await db
    .collection<Project>("projects")
    .find({})
    .toArray();
  const user = await db
    .collection<User>("users")
    .find({ _id: new ObjectID(decipheredUserId)})
    .toArray();
  return {
    projects: data.map(v => ({ ...v, _id: v._id.toString() })),
    user: {
      email: user[0].email
    },
  }
};