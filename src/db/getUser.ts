import type { Cookies } from "@sveltejs/kit";
import type { Db, WithId } from "mongodb";
import { DATABASE_NAME } from "$env/static/private";
import { decipherUserId } from "$db/security";
import { error } from "@sveltejs/kit";
import { ObjectID } from "bson";
import clientPromise from "$db/mongo";
import logOutUser from "./logOutUser";
import ip from "ip";

// The return value of the function.
interface DatabaseDataWithUser {
  user: WithId<User>,
  decipheredUserId: string,
  db: Db;
}

/**
 * Use this function to get the instance of the logged in user.
 * As this may be useful in a lot of features throughout your entire app,
 * in addition to the user's data, you can also retrieve the instance of the database,
 * and some other information that often comes in handy.
 * @param cookies The cookies. One must be "userId".
 * @param database The instance of the database if it's already been initiliazed earlier in your algorithm.
 * @returns The user's data, plus the instance of the database and the deciphered user id.
 */
export default async function getUser(cookies: Cookies, database?: Db): Promise<DatabaseDataWithUser> {
  const userId = cookies.get('userId');
  if (!userId) {
    throw error(401, "Unauthorized");
  }
  const decipheredUserId = decipherUserId(userId, ip.address());
  const db = database ?? (await clientPromise).db(DATABASE_NAME);
  let objectId;
  try {
    // If the user IP address is not the same as when he first logged in, he must be disconnected.
    // As a consequence, it is probable that the result will not be valid data to pass in ObjectID, hence the `try catch`.
    // It is very unlikely that the deciphered userId happens to be the exact ID of another user, so it's neglected.
    objectId = new ObjectID(decipheredUserId);
  } catch (e) {
    logOutUser(cookies);
    throw error(400, "Invalid session.");
  }
  const user = await db
    .collection<User>("users")
    .findOne({ _id: new ObjectID(decipheredUserId) });
  // This verification needs to be added every time we fetch the user's data
  // because it could be removed from the database in between.
  // This happens when the user deletes his account on another session for example.
  if (user == null) {
    logOutUser(cookies);
    throw error(400, "Bad request or the user doesn't exist.");
  }
  return {
    db,
    user,
    decipheredUserId,
  }
}