import type { RequestHandler } from "./$types";
import { DATABASE_NAME } from "$env/static/private";
import { json } from "@sveltejs/kit";
import { downloadFile } from "$db/gfs";
import clientPromise from "$db/mongo";

// A request to get the raw data of a file.
// This request accepts two properties :
// `fileId` (a string) which is the Object ID of the file to get the data from.
// `bucketName` (a string) which is the name of the bucket currently storing the data.
export const POST = (async ({request}) => {
  const db = (await clientPromise).db(DATABASE_NAME);
  const { fileId, bucketName } = await request.json();
  if (fileId == undefined) {
    return new Response("Missing file ID.", { status: 400 });
  }
  let image: Buffer[] | undefined;
  try {
    image = await downloadFile(fileId, db, bucketName);
  } catch (e) {
    return new Response("The image couldn't be retrieved from the database. Maybe it doesn't exist.", { status: 404 });
  }
  return json(image);
}) satisfies RequestHandler;