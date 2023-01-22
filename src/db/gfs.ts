import type { Db, Filter, GridFSFile, FindOptions, Document } from "mongodb";
import { GridFSBucket, ObjectId } from "mongodb";

// Useful link: https://www.mongodb.com/docs/drivers/node/v3.6/fundamentals/gridfs/

/**
 * Uploads a file using GridFS.
 * @param filename The name of the file.
 * @param data Its data as a Blob.
 * @param db The database instance.
 * @param options Options including custom bucket name and file's metadata.
 * @returns The Object ID of the document storing the file.
 */
export async function uploadFile(filename: string, data: Blob, db: Db, options?: UploadOptions): Promise<string> {
  const buffer = Buffer.from(new Uint8Array(await data.arrayBuffer())); // ArrayBuffer -> Uint8Array -> Buffer
  return new Promise((resolve, reject) => {
    const gfs = new GridFSBucket(db, { bucketName: options?.bucketName ?? "fs" });
    const stream = gfs.openUploadStream(filename, { metadata: { ...options?.metadata } });
    stream.write(buffer);
    stream.on("error", reject);
    stream.end((_, file) => {
      if (file) {
        resolve(file._id.toString());
      }
    });
  });
}

/**
 * Gets an uploaded file from the database according to its unique ID.
 * This method returns the chunks of the file.
 * Indeed, MongoDB scatters the file into chunks of around 255KB each.
 * The chunks are stored within the collection entitled "fs.chunks",
 * and the reference to each file is stored in the "fs.files" collection.
 * @param fileId The Object ID of the file.
 * @param db The database instance.
 * @param bucketName The name of the bucket.
 * @returns The list of chunks as buffers.
 */
export async function downloadFile(fileId: ObjectId | string, db: Db, bucketName?: string): Promise<Buffer[]> {
  return new Promise((resolve, reject) => {
    const gfs = new GridFSBucket(db, { bucketName: bucketName ?? "fs" });
    // To get a file according to its name instead of its ID,
    // use the method : `openDownloadStreamByName`.
    const stream = gfs.openDownloadStream(typeof fileId === "string" ? new ObjectId(fileId) : fileId);
    const chunks: Buffer[] = [];
    stream.start();
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(chunks));
    stream.on("error", reject);
    stream.end();
  });
}

/**
 * Gets info on files.
 * @param filter The filter conditions.
 * @param db The database instance.
 * @param options The options of the filter.
 * @param bucketName The name of the bucket.
 * @returns The collection(s) associated with the file(s) that satisfy the filter.
 */
export async function findUploadedFile(filter: Filter<GridFSFile> = {}, db: Db, options?: FindOptions<Document>, bucketName?: string): Promise<GridFSFile[]> {
  return await new GridFSBucket(db, { bucketName: bucketName ?? "fs" }).find(filter, options).toArray();
}

/**
 * Deletes a file.
 * @param fileId The Object ID of the file.
 * @param db The instance of the database.
 * @param bucketName The name of the bucket, by default "fs".
 */
export async function deleteFile(fileId: ObjectId | string, db: Db, bucketName?: string): Promise<void> {
  await new GridFSBucket(db, { bucketName: bucketName ?? "fs" }).delete(typeof fileId === "string" ? new ObjectId(fileId) : fileId);
}

/**
 * Deletes the file of the given ID in order to replace it with another one.
 * Given the file ID, the function assumes the file exists and won't verify that.
 * @param fileId The Object ID of the file.
 * @param filename The name of the file (its given name on upload. Not necessarily the name the user gave to his file).
 * @param data The raw data of the file to upload, as a Blob.
 * @param db The database instance.
 * @param options Options related to the upload.
 * @returns The Object ID of the document storing the file.
 */
export async function replaceFile(fileId: ObjectId | string, filename: string, data: Blob, db: Db, options?: UploadOptions) {
  await deleteFile(fileId, db, options?.bucketName ?? "fs");
  return await uploadFile(filename, data, db, options);
}

/**
 * Renames a file.
 * @param fileId The Object ID of the file.
 * @param newName The new name of the file.
 * @param db The database instance.
 * @param bucketName The name of the bucket, by default "fs".
 */
export async function renameFile(fileId: ObjectId | string, newName: string, db: Db, bucketName?: string): Promise<void> {
  await new GridFSBucket(db, { bucketName: bucketName ?? "fs" }).rename(typeof fileId === "string" ? new ObjectId(fileId) : fileId, newName);
}


/**
 * Deletes every files of the specified bucket along with their documents in the specified database.
 * @param bucketName The name of the bucket.
 * @param db The database instance.
 */
export async function deleteBucket(bucketName: string, db: Db): Promise<void> {
  await new GridFSBucket(db, { bucketName }).drop();
}