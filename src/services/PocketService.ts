import { Pocket } from "../generated/prisma"
import prisma from "../lib/prisma"

export class PocketService {
	async findByUserId(userId: string): Promise<Pocket[]> {
		return prisma.pocket.findMany({
			where: { userId },
		})
	}

	async create(userId: string): Promise<Pocket> {
		return prisma.pocket.create({
			data: {
				userId,
			},
		})
	}

	async delete(id: string): Promise<Pocket> {
		return prisma.pocket.delete({
			where: { id },
		})
	}

	async findById(id: string): Promise<Pocket | null> {
		return prisma.pocket.findUnique({
			where: { id },
		})
	}
}
