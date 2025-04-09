import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { prettyJSON } from "hono/pretty-json"
import users from "./routes/users"
import spots from "./routes/spots"
import auth from "./routes/auth"
import notes from "./routes/notes"
import pockets from "./routes/pockets"
import { authMiddleware } from "./middleware/auth"

const app = new Hono()

// Middleware globaux
app.use("*", cors())
app.use("*", logger())
app.use("*", prettyJSON())

// Route de base
app.get("/", (c) => {
	return c.json({
		message: "Bienvenue sur l'API Fugo",
		version: "1.0.0",
	})
})

// Routes d'authentification (non protégées)
app.route("/api/auth", auth)

// Routes protégées
app.use("/api/*", authMiddleware)
app.route("/api/users", users)
app.route("/api/spots", spots)
app.route("/api/notes", notes)
app.route("/api/pockets", pockets)

// Point d'entrée pour Bun
export default {
	port: process.env.PORT || 3000,
	fetch: app.fetch,
}
