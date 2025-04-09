import { Context } from "hono"
import { SpotService } from "../services/SpotService"
import { Spot } from "../generated/prisma"
import { uploadImage } from "../lib/minioController"

const spotService = new SpotService()

export class SpotController {
	async getAll(c: Context) {
		try {
			const spots = await spotService.findAll()
			return c.json(spots)
		} catch (error) {
			return c.json({ error: "Erreur lors de la récupération des spots" }, 500)
		}
	}

	async getById(c: Context) {
		try {
			const id = c.req.param("id")
			const spot = await spotService.findById(id)

			if (!spot) {
				return c.json({ error: "Spot non trouvé" }, 404)
			}

			return c.json(spot)
		} catch (error) {
			return c.json({ error: "Erreur lors de la récupération du spot" }, 500)
		}
	}

	async create(c: Context) {
		try {
			const data = await c.req.json<Omit<Spot, "id" | "createdAt" | "updatedAt">>()
			const spot = await spotService.create(data)
			return c.json(spot, 201)
		} catch (error) {
			return c.json({ error: "Erreur lors de la création du spot" }, 500)
		}
	}

	async update(c: Context) {
		try {
			const id = c.req.param("id")
			const data = await c.req.json<Partial<Spot>>()
			const spot = await spotService.update(id, data)
			return c.json(spot)
		} catch (error) {
			return c.json({ error: "Erreur lors de la mise à jour du spot" }, 500)
		}
	}

	async delete(c: Context) {
		try {
			const id = c.req.param("id")
			await spotService.delete(id)
			return c.json({ message: "Spot supprimé avec succès" })
		} catch (error) {
			return c.json({ error: "Erreur lors de la suppression du spot" }, 500)
		}
	}

	async addToFavorites(c: Context) {
		try {
			const spotId = c.req.param("id")
			const { userId } = await c.req.json<{ userId: string }>()
			const spot = await spotService.addToFavorites(spotId, userId)
			return c.json(spot)
		} catch (error) {
			return c.json({ error: "Erreur lors de l'ajout aux favoris" }, 500)
		}
	}

	async addSpotPhoto(c: Context) {
		try {
			const spotId = c.req.param("id")
			const file = (c.req as any).file
			if (!file) {
				return c.json({ error: "Aucun fichier n'a été uploadé" }, 400)
			}
			const imageUrl = await uploadImage(file.buffer, file.originalname)

			await spotService.addSpotPhoto(spotId, imageUrl)

			return c.json({ message: "Photo ajoutée", imageUrl })
		} catch (error) {
			return c.json({ error: "Erreur lors de l'ajout de la photo" }, 500)
		}
	}
}
