import bcrypt from "bcrypt";

/**
 * Hashes the given password.
 * @param password The password to be hashed.
 * @returns The hash.
 */
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

/**
 * Checks if the given password matches one from the database.
 * @param plainPassword The password from the form.
 * @param hashedPassword The hashed password from the database.
 * @returns Whether the password matches the hashed one or not.
 */
export function validatePassword(plainPassword: string, hashedPassword: string) {
  return bcrypt.compareSync(plainPassword, hashedPassword);
}

/**
 * Encrypts the user ID using his IP address as key.
 * This is to make sure that our cookie cannot be replayed.
 * @param userId The object ID of the user in the database.
 * @param ip The IP address of the user that logged in.
 * @returns The encrypted user ID.
 */
export function encryptUserId(userId: string, ip: string) {
  const y = parseInt(ip.split(".").at(-1)!);
  let encoded = "";
  for (let i = 0; i < userId.length; i++) {
    if (!isNaN(userId[i] as any)) {
      encoded += (parseInt(userId[i]) + y) % 10;
    } else {
      encoded += String.fromCharCode(userId[i].charCodeAt(0) + y % 26);
    }
  }
  return encoded;
}

/**
 * Deciphers the encrypted user ID of the "userId" cookie.
 * @param userId The object ID of the user in the database.
 * @param ip His IP address
 * @return The real object ID of the user used to access his personal data in the database.
 */
export function decipherUserId(userId: string, ip: string): string {
  const y = parseInt(ip.split(".").at(-1)!);
  let result = "";
  for (let i = 0; i < userId.length; i++) {
    if (!isNaN(userId[i] as any)) {
      let r = parseInt(userId[i]) - y % 10;
      if (r < 0) {
        r = 10 + r;
      }
      result += r;
    } else {
      result += String.fromCharCode(userId[i].charCodeAt(0) - y % 26);
    }
  }
  return result;
}