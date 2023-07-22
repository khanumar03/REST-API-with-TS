import express from "express";
import { getUserByEmail, createUser } from "../db/users";
import { random, authentication } from "../helpers";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(203).json({ message: "All Feilds are Required" });
    }

    const user = await getUserByEmail(email).select({
      authentication: true,
    }); // CHANGE
    console.log(user);

    if (!user) {
      return res.status(203).json({ message: "User does not exist !" });
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password != expectedHash) {
      return res.status(403).json({ message: "Email or Password is wrong !" });
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );
    await user.save();

    res.cookie("REST-AUTH", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    // console.log(email, password, username);

    if (!email || !password || !username) {
      return res.status(203).json({ message: "All Feilds are Required" });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(203).json({ message: "Already Existed" });
    }

    const salt = random();
    console.log();

    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    console.log(user);

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
};
