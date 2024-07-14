import { Router } from "express";
import { getUserByUsername, registerUser, loginUser, logOutUser, updatePassword, updateEmail } from "../controllers/user.controller";
import verifyToken from "../middlewares/auth.middleware";
const userRouter = Router();

userRouter.get("/", (req, res) => {
  res.send("Hello from route /");
});

userRouter.post("/register", registerUser);
userRouter.get("/:username", getUserByUsername);
userRouter.post("/login", loginUser);
userRouter.post("/logout", verifyToken, logOutUser);
userRouter.post("/update-password", verifyToken, updatePassword);
userRouter.post("/update-email", verifyToken, updateEmail);


export default userRouter;