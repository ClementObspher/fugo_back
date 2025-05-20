import { PrismaClient, Equipment, HealthStatus, SpotDanger } from "../src/generated/prisma"
import * as bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
	// Création d'un utilisateur
	const user = await prisma.user.create({
		data: {
			email: "test@example.com",
			password: await bcrypt.hash("P@ssw0rd", 10),
			username: "testuser",
			firstName: "Jean",
			lastName: "Dupont",
			birthDate: new Date("1990-01-01"),
			equipment: [Equipment.MASK, Equipment.SNORKEL, Equipment.FINS],
			status: HealthStatus.EXCELLENT,
			country: "France",
			city: "Paris",
			region: "Île-de-France",
			street: "Rue de la Paix",
			number: "1",
			latitude: 48.8566,
			longitude: 2.3522,
		},
	})

	// Création de plusieurs spots
	const spots = await prisma.spot.createMany({
		data: [
			{
				name: "Plage de Pampelonne",
				description: "Une magnifique plage de sable fin avec des eaux cristallines",
				photos: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
				dangers: [SpotDanger.STRONG_CURRENTS, SpotDanger.HIGH_WAVES],
				creatorId: user.id,
				latitude: 43.2471,
				longitude: 6.6392,
			},
			{
				name: "Calanque d'En-Vau",
				description: "Spot sauvage entouré de falaises, eau turquoise.",
				photos: ["https://example.com/photo3.jpg"],
				dangers: [SpotDanger.LOW_VISIBILITY, SpotDanger.CAVES_AND_BLUE_HOLES],
				creatorId: user.id,
				latitude: 43.2047,
				longitude: 5.4984,
			},
			{
				name: "Étang de Thau",
				description: "Grande lagune, idéale pour l'observation de la faune.",
				photos: ["https://example.com/photo4.jpg"],
				dangers: [SpotDanger.BOAT_TRAFFIC],
				creatorId: user.id,
				latitude: 43.4101,
				longitude: 3.6656,
			},
		],
	})

	// Récupération des spots créés (pour les relations)
	const allSpots = await prisma.spot.findMany({ where: { creatorId: user.id } })

	// Création de plusieurs notes
	await prisma.note.createMany({
		data: [
			{ note: 5, userId: user.id },
			{ note: 4, userId: user.id },
			{ note: 3, userId: user.id },
		],
	})

	// Création de plusieurs pockets
	await prisma.pocket.createMany({
		data: [{ userId: user.id }, { userId: user.id }],
	})

	// Création de plusieurs explorations
	for (const spot of allSpots) {
		await prisma.exploration.create({
			data: {
				userId: user.id,
				spotId: spot.id,
			},
		})
	}

	console.log("Données de test enrichies avec succès !")
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
