import { Hono } from "hono"
import { AuthController } from "../controllers/AuthController"

const auth = new Hono()
const authController = new AuthController()

auth.post("/login", (c) => authController.login(c))

export default auth
