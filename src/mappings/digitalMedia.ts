import { DigitalMediaCreateEvent } from "../../generated/makersplace/makerstokenv2";

import { digitalMedia as digitalMediaModule } from "../modules"


export function handleDigitalMediaCreateEvent(event: DigitalMediaCreateEvent): void {
	let digitalMedia = digitalMediaModule.getOrCreateDigitalMedia(
		event.params.id.toHex(),
		event.params.storeContractAddress,
		event.params.creator,
		event.params.totalSupply,
		event.params.collectionId,
		event.params.printIndex,
		event.params.metadataPath
	)
	digitalMedia.save()
}
