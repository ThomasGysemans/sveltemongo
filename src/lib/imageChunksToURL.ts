/**
 * Creates an URL that `img` tags can use as source to display a picture
 * rebuilt from the chunks of the original image scattered by GridFS.
 * @param chunks The chunks of file's data retrieved from the database.
 * @param type The type of the image, to make sure the image is properly interpreted.
 * @returns An URL leading to the image.
 */
export default function imageChunksToURL(chunks: Chunk[], type: string): string {
  return URL.createObjectURL(new Blob(chunks.map(p => new Uint8Array(p.data)), { type }));
}