import type { RequestHandler } from "./$types";
import { downloadFile, findUploadedFile } from "$db/gfs";
import { DATABASE_NAME } from "$env/static/private";
import { json } from "@sveltejs/kit";
import { ObjectId } from "mongodb";
import clientPromise from "$db/mongo";

interface RequestInput {
  fileId: string;
  bucketName: string;
}

// A request to get the raw data of a file.
// This request accepts two properties :
// `fileId` (a string) which is the Object ID of the file to get the data from.
// `bucketName` (a string) which is the name of the bucket currently storing the data.
export const POST = (async ({request}) => {
  const db = (await clientPromise).db(DATABASE_NAME);
  const { fileId, bucketName } = await request.json() as RequestInput;
  if (fileId == undefined) {
    return new Response("Missing file ID.", { status: 400 });
  }
  let image: Chunk[] | undefined;
  let type: string;
  try {
    const imageDocument = (await findUploadedFile({ _id: new ObjectId(fileId) }, db, undefined, bucketName))[0];
    if (imageDocument == null) {
      return new Response("The file doesn't exist.", { status: 404 });
    }
    type = imageDocument.metadata!.type;
    image = await downloadFile(fileId, db, bucketName);
  } catch (e) {
    return new Response("The image couldn't be retrieved from the database. Maybe it doesn't exist.", { status: 404 });
  }
  return json({
    data: image,
    type
  });
}) satisfies RequestHandler;