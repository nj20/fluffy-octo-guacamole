import jwt, { Secret } from "jsonwebtoken";

export const getRoleFromSessionToken = (token: string): string => {
  const { role } = jwt.verify(token, process.env.JWT_SECRET as Secret) as {
    role: string;
  };
  return role;
};

//We can do more complex checks if necessary. For example, we can check if the username is a valid email address.
export const isUsernameAcceptable = (username: string) =>
  username && username.length > 0;

//We can do more complex checks if necessary. For example, we can check if the password is strong enough.
export const isPasswordAcceptable = (password: string) =>
  password && password.length > 0;
