import { Router } from "express";

const userRouter = Router();

userRouter.get("/", (req, res) => {
  res.send("Hello from route /");
});



userRouter.get("/:id", (req, res) => {
    const { id } = req.params;
  res.send(`Hello from route /users/${id}`);
});


export default userRouter;