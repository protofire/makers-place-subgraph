import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { DigitalMedia } from "../../../generated/schema";

export namespace digitalMedia {
	export function getOrCreateDigitalMedia(
		id: string, storeContract: Bytes, creator: Bytes,
		totalSupply: BigInt, collectionId: BigInt,
		printIndex: BigInt, metadataPath: string

	): DigitalMedia {
		let entity = DigitalMedia.load(id)
		if (entity == null) {
			entity = new DigitalMedia(id)
			entity.storeContractAddress = storeContract
			entity.creatorAddress = creator
			entity.totalSupply = totalSupply
			entity.printIndex = printIndex
			entity.collectionId = collectionId
			entity.metadataPath = metadataPath
		}
		return entity as DigitalMedia
	}

	export function burnToken(id: string): DigitalMedia {
		let entity = DigitalMedia.load(id)
		if (entity == null) {
			entity = new DigitalMedia(id)
		}
		entity.burned = true
		return entity as DigitalMedia
	}
}