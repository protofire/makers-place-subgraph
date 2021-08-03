import { Bytes } from "@graphprotocol/graph-ts";
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
		}
		return entity as DigitalMediaCollection
	}
	export function increasedigitalMediaAmount(id: string): DigitalMediaCollection {
		let entity = DigitalMediaCollection.load(id)
		if (entity == null) {
			return null as DigitalMediaCollection
		}
		entity.digitalMediaAmount = entity.digitalMediaAmount.plus(integer.ONE)
		return entity as DigitalMediaCollection
	}
}