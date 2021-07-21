import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { DigitalMediaRelease } from "../../../generated/schema";

export namespace releases {
	export function getOrCreateDigitalMediaRelease(
		id: string, owner: Bytes, printEdition: BigInt,
		tokenURI: string, digitalMediaId: string
	): DigitalMediaRelease {
		let entity = DigitalMediaRelease.load(id)
		if (entity == null) {
			entity = new DigitalMediaRelease(id)
			entity.owner = owner
			entity.printEdition = printEdition
			entity.tokenURI = tokenURI
			entity.digitalMedia = digitalMediaId
		}
		return entity as DigitalMediaRelease
	}

	export function burnToken(id: string): DigitalMediaRelease {
		let entity = DigitalMediaRelease.load(id)
		if (entity == null) {
			entity = new DigitalMediaRelease(id)
		}
		entity.burned = true
		return entity as DigitalMediaRelease
	}
}