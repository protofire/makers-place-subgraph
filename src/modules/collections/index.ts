import { Bytes, log } from "@graphprotocol/graph-ts";
import { integer } from "@protofire/subgraph-toolkit";
import { DigitalMediaCollection } from "../../../generated/schema";

export namespace collections {
	export function getOrCreateDigitalMediaCollection(
		id: string, creator: string, storeContract: Bytes,
		metadataPath: string
	): DigitalMediaCollection {
		let entity = DigitalMediaCollection.load(id)
		if (entity == null) {
			entity = new DigitalMediaCollection(id)
			entity.storeContractAddress = storeContract
			entity.creator = creator
			entity.metadataPath = metadataPath
			entity.digitalMediaAmount = integer.ZERO
		}
		return entity as DigitalMediaCollection
	}
	export function increasedigitalMediaAmount(id: string): DigitalMediaCollection {
		if (id == null) {
			log.error("the value for collection id was null :: {}", [id])
		}
		let entity = DigitalMediaCollection.load(id)
		if (entity == null) {
			entity = new DigitalMediaCollection(id)
			entity.digitalMediaAmount = integer.ZERO
		}
		entity.digitalMediaAmount = entity.digitalMediaAmount.plus(integer.ONE)
		return entity as DigitalMediaCollection
	}
}