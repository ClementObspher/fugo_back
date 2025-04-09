import { SpotDangersEnum } from "../enums/SpotDangersEnum"
import { Geolocation } from "./Geolocation"

export interface Spot {
	id: string
	user_id: string
	name: string
	description: string
	geolocation: Geolocation
	photos: string[]
	dangers: SpotDangersEnum[]
}
