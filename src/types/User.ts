import { HealthStatusEnum } from "../enums/HealthStatusEnum"
import { WaterEquipmentEnum } from "../enums/WaterEquipmentEnum"
import { Geolocation } from "./Geolocation"

export interface User {
	id: string
	email: string
	password: string
	username: string
	first_name: string
	last_name: string
	birth_date: Date
	jobs: string
	equipment: WaterEquipmentEnum[]
	friends: User[]
	social_media?: Note[]
	pockets: Pocket[]
	displayName?: string
	geoAddress?: Geolocation
	status: HealthStatusEnum
}

export interface Note {
	user_id: string
	note: number
	date: Date
}

export interface Pocket {
	id: string
	user_id: string
}
