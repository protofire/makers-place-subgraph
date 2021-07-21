import { ADDRESS_ZERO } from '@protofire/subgraph-toolkit'
import {
	Approval,
	ApprovalForAll,
	Transfer,
	DigitalMediaCreateEvent,
	DigitalMediaBurnEvent,
	DigitalMediaReleaseCreateEvent,
	DigitalMediaReleaseBurnEvent,
	DigitalMediaCollectionCreateEvent
} from "../../generated/makersplace/makerstokenv2";

import { transfer } from "./transfer"

import {
	tokens,
	accounts,
	blocks,
	transactionsMeta,
	digitalMedia as digitalMediaModule,
	releases,
	collections
} from "../modules";

export function handleDigitalMediaCollectionCreate(event: DigitalMediaCollectionCreateEvent): void {
	let collection = collections.getOrCreateDigitalMediaCollection(
		event.params.id.toHex(),
		event.params.creator,
		event.params.storeContractAddress,
		event.params.metadataPath ,
	)
	collection.save()
}

export function handleDigitalMediaReleaseBurn(event: DigitalMediaReleaseBurnEvent): void {
	let release = releases.burnToken(event.params.tokenId.toHex())
	release.save()
}

export function handleDigitalMediaReleaseCreate(event: DigitalMediaReleaseCreateEvent): void {
	let release = releases.getOrCreateDigitalMediaRelease(
		event.params.id.toHex(),
		event.params.owner,
		event.params.printEdition,
		event.params.tokenURI,
		event.params.digitalMediaId.toHex()
	)
	release.save()

}

export function handleDigitalMediaBurn(event: DigitalMediaBurnEvent): void {
	let digitalMedia = digitalMediaModule.burnToken(
		event.params.id.toHex()
	)
	digitalMedia.save()
}

export function handleDigitalMediaCreate(event: DigitalMediaCreateEvent): void {
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

export function handleTransfer(event: Transfer): void {

	let from = event.params._from.toHex()
	let to = event.params._to.toHex()
	let tokenId = event.params._tokenId.toHex()
	let blockNumber = event.block.number
	let blockId = blockNumber.toString()
	let txHash = event.transaction.hash
	let timestamp = event.block.timestamp

	let block = blocks.getOrCreateBlock(blockId, timestamp, blockNumber)
	block.save()

	let meta = transactionsMeta.getOrCreateTransactionMeta(
		txHash.toHexString(),
		blockId,
		txHash,
		event.transaction.from,
		event.transaction.gasUsed,
		event.transaction.gasPrice,
	)
	meta.save()

	if (from == ADDRESS_ZERO) {
		transfer.handleMint(event.params._to, tokenId, timestamp, blockId)
	} else if (to == ADDRESS_ZERO) {
		transfer.handleBurn(event.params._from, tokenId, timestamp, blockId)
	} else {
		transfer.handleRegularTransfer(event.params._from, event.params._to, tokenId, timestamp, blockId)
	}

}

export function handleApproval(event: Approval): void {
	let tokenId = event.params._tokenId.toHex()
	let ownerAddress = event.params._owner
	let approvedAddress = event.params._approved

	let approved = accounts.getOrCreateAccount(approvedAddress)
	approved.save()

	let owner = accounts.getOrCreateAccount(ownerAddress)
	owner.save()

	let token = tokens.addApproval(tokenId, approvedAddress.toHex(), ownerAddress.toHex())
	token.save()
}

export function handleApprovalForAll(event: ApprovalForAll): void {
	let ownerAddress = event.params._owner
	let operatorAddress = event.params._operator

	let owner = accounts.getOrCreateAccount(ownerAddress)
	owner.save()

	let operator = accounts.getOrCreateAccount(operatorAddress)
	operator.save()

	let operatorOwner = accounts.getOrCreateOperatorOwner(owner.id, operator.id, event.params._approved)
	operatorOwner.save()

}
