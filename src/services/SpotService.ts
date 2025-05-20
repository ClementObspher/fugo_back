import { Spot } from "../generated/prisma"
import prisma from "../lib/prisma"

export class SpotService {
	async findAll(): Promise<Spot[]> {
		return prisma.spot.findMany({
			include: {
				creator: true,
				favoritedBy: true,
			},
		})
	}

	async findById(id: string): Promise<Spot | null> {
		return prisma.spot.findUnique({
			where: { id },
			include: {
				creator: true,
				favoritedBy: true,
			},
		})
	}

	async create(data: Omit<Spot, "id" | "createdAt" | "updatedAt">): Promise<Spot> {
		return prisma.spot.create({
			data,
			include: {
				creator: true,
			},
		})
	}

	async update(id: string, data: Partial<Spot>): Promise<Spot> {
		return prisma.spot.update({
			where: { id },
			data,
			include: {
				creator: true,
			},
		})
	}

	async delete(id: string): Promise<Spot> {
		return prisma.spot.delete({
			where: { id },
		})
	}

	async addToFavorites(spotId: string, userId: string): Promise<Spot> {
		return prisma.spot.update({
			where: { id: spotId },
			data: {
				favoritedBy: {
					connect: { id: userId },
				},
			},
		})
	}

	async addSpotPhoto(spotId: string, imageUrl: string): Promise<void> {
		await prisma.spot.update({
			where: { id: spotId },
			data: { photos: { push: imageUrl } },
		})
	}

	async getUserSpots(userId: string): Promise<Spot[]> {
		return prisma.spot.findMany({
			where: {
				creatorId: userId,
			},
		})
	}
}
