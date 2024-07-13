import { Router } from "express";
import { registerUser } from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/", (req, res) => {
  res.send("Hello from route /");
});

userRouter.post("/register", registerUser);


userRouter.get("/:id", (req, res) => {
    const { id } = req.params;
  res.send(`Hello from route /users/${id}`);
});


export default userRouter;