/**
 * Creates an URL that `img` tags can use as source to display a picture
 * rebuilt from the chunks of the original image scattered by GridFS.
 * @param chunks The chunks of file's data retrieved from the database.
 * @returns An URL leading to the image.
 */
export default function imageChunksToURL(chunks: Chunk[]): string {
  return URL.createObjectURL(new Blob(chunks.map(p => new Uint8Array(p.data))));
}