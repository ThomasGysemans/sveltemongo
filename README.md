# SvelteMongo

SvelteKit App using MongoDB as backend with custom authentication and [GridFS](https://www.mongodb.com/docs/manual/core/gridfs/) helper functions.

## Get started

Create a `.env` file at the root of your application and add the following variables :

```
MONGODB_URI=mongodb+srv://...
DATABASE_NAME=
```

Use your own connection URI available in your personal space within MongoDB. Add the name of the database you'll be using in your project. If you want to use several databases, feel free to change this behaviour.

#### Test the template

A full working backend is already built on top of this template. Create the right database and you'll be able to test it!

I'm using a database which has the following collections :

- `users`

```typescript
{
  email: string,
  password: string,
  picture?: string
}
```

- `projects`

```typescript
{
  title: string
}
```

The homepage is composed of a form asking you to log in or to sign in. Once connected, you'll be able to see the list of all the projects of your "projects" collection ([./src/routes/projects/](./src/routes/projects/)). The user also has a unique profile page where he can upload his own profile picture.

## Security

I use a custom method to encrypt the user ID of the cookie. To maximise the security of the cookie it is also set as `secure` and `httpOnly` (so only accessible in the server), with strict `SameSite` attribute. To avoid the cookie to be replayed, it is encrypted using the IP address of the user as key.

If, for some reason, the user has a different IP address than when he first logged in, during the same session, then he'll be disconnected (meaning the cookie is deleted).

## Deploy your app

Make sure the secret variables are stored in `.env` files and that those files are registered in `.gitignore`. Push on GitHub and then deploy on [Vercel](https://vercel.com/dashboard) and set your environment variables there using their GUI.

## Available helpers

The goal of this template is to help you get started more quickly when building a project with SvelteKit by giving you all the necessary tools such as `SCSS` or `FontAwesome`. Obviously, if you're using this template, it also means that you need a backend. Implementing MongoDB can be a pain, especially if you want to store files (images for example) so the template comes with a set of basic functions using the [GridFS](https://www.mongodb.com/docs/manual/core/gridfs/) method :

- `uploadFile` to upload a file (using [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) data)
- `downloadFile` to download a file stored in your database.
- `replaceFile` to delete one, and to upload one with the same name.
- `findUploadedFile` to get the information related to a file. **This does not include its raw data**.
- `deleteFile` to delete a file.
- `renameFile` to rename a file.
- `deleteBucket` to delete everything in the specified bucket.

Find these helper functions in [gfs.ts](./src/db/gfs.ts). Find more functions in [db](./src/db/) and [lib](./src/lib) folders. The `db` folder contains functions that are server-only (meaning they can't be executed on the client side). On the contrary, the `lib` folder contains client-only functions.

## Technologies

This template is using the following dependencies that often come in handy :

- [FontAwesome](https://www.npmjs.com/package/svelte-fa)
- SCSS, SASS (`node-sass` & `svelte-preprocess`)

Note that despite the use of `GridFS`, and contrary to most tutorials out there, `mongoose` and `multer` are **not necessary**. By using the API directly the goal is to reduce as much as possible the useless dependencies.

_For more details about SCSS/SASS and how to use VSCode with it, see [this article](https://daveceddia.com/svelte-with-sass-in-vscode/)._

_Also, for more details about FontAwesome, see [this article](https://cweili.github.io/svelte-fa/). Note that it is a bit outdated so there is a [section explaining that](#fontawesome) in this README._

And necessary dependencies :

- [MongoDB](https://www.npmjs.com/package/mongodb)
- [ip](https://www.npmjs.com/package/ip) 
- [bcrypt](https://www.npmjs.com/package/bcrypt)

## FontAwesome

Assuming you're only using the free version of FontAwesome, everything you need is already installed. Use the icons like this:

```html
<script>
  import Fa from 'svelte-fa';
  import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
</script>

<a>See what's below <Fa icon={faArrowDown} size="xs" /><a>
```

In this project, only the solid and regular icons are available. Add more icon types like this :

```
npm i @fortawesome/free-regular-svg-icons
```

Replace `regular` with `solid`, `brand` or whatever.