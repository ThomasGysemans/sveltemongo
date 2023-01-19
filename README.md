# SvelteMongo

SvelteKit App using MongoDB as backend with custom authentication.

## Security

I use a custom method to encrypt the user ID of the cookie. First, it is set as `secure` so only accessible in the server. To avoid the cookie to be replayed, it is encrypted using the IP address of the user as key.