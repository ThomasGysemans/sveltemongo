# SvelteMongo

SvelteKit App using MongoDB as backend with custom authentication.

## Technologies

This template is using the following dependencies that often come in handy :

- [FontAwesome](https://www.npmjs.com/package/svelte-fa)
- SCSS, SASS

_For more details about SCSS/SASS and how to use VSCode with it, see [this article](https://daveceddia.com/svelte-with-sass-in-vscode/)._

_Also, for more details about FontAwesome, see [this article](https://cweili.github.io/svelte-fa/). Note that it is a bit outdated so there is a [section explaining that](#fontawesome) in this README._

And necessary dependencies :

- [MongoDB](https://www.npmjs.com/package/mongodb)
- [ip](https://www.npmjs.com/package/ip) 
- [bcrypt](https://www.npmjs.com/package/bcrypt)

## Security

I use a custom method to encrypt the user ID of the cookie. First, it is set as `secure` so only accessible in the server. To avoid the cookie to be replayed, it is encrypted using the IP address of the user as key.

## FontAwesome

Assuming you're only using the free version of FontAwesome, everything you need is already installed. Use the icons like this:

```html
<script>
  import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
</script>

<a>See what's below <Fa icon={faArrowDown} size="xs" /><a>
```

In this project, only the solid and regular icons are available. Add more icon types like this :

```
npm i @fortawesome/free-regular-svg-icons
```

Replace `regular` with `solid`, `brand` or whatever.