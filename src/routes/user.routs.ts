import { Router } from "express";
import { getUserByUsername, registerUser } from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/", (req, res) => {
  res.send("Hello from route /");
});

userRouter.post("/register", registerUser);


userRouter.get("/:username", getUserByUsername);


export default userRouter;