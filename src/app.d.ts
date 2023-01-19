import { MongoClient } from 'mongodb';

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

	var _mongoClientPromise: Promise<MongoClient>

	interface Project {
		title: string;
	}

	interface User {
		email: string;
		password: string;
	}
}

export {};
