import type { Binary, MongoClient, Document } from 'mongodb';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	// Something we use to connect the client.
	// If is useless in production,
	// but in development mode,
	// it is great for performance.
	var _mongoClientPromise: Promise<MongoClient>;

	// Useless interface for the example.
	interface Project {
		title: string;
	}

	// The basic model of a User.
	interface User {
		email: string; // the email address
		password: string; // the hashed password
		picture?: string; // the Object Id leading to the file of his profile picture
	}

	// Metadata for uploading files + a custom one I recommend
	interface UploadMetadata extends Document {
		uploadedBy?: string;
	}

	// Options for uploading files with the helper function
	interface UploadOptions {
		bucketName?: string;
		metadata: UploadMetadata;
	}

	// A serialised chunk of file scattered using `GridFS`
	interface Chunk {
		type: "Buffer";
		data: number[];
	}
}

export {};
