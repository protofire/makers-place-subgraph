import { ADDRESS_ZERO } from '@protofire/subgraph-toolkit'
import {
	Approval,
	ApprovalForAll,
	Transfer,
	DigitalMediaCreateEvent,
	DigitalMediaBurnEvent,
	DigitalMediaReleaseCreateEvent,
	DigitalMediaReleaseBurnEvent,
	DigitalMediaCollectionCreateEvent,
	ChangedCreator,
	UpdateDigitalMediaPrintIndexEvent,
	OboApprovalForAll,
	OboDisabledForAll
} from "../../generated/makersplace/makerstokenv2";
/**
* TODO: missing for index
* - Pause()
* - Unpause()
* - OboApprovalForAll(address,address,bool)
* - OboDisabledForAll(address)
* - SingleCreatorChanged(indexed address,indexed address)
* FIXME: Modules should consider pure and side effect distinctions
*/
import { transfer } from "./transfer"

import {
	tokens,
	accounts,
	digitalMedia as digitalMediaModule,
	releases,
	collections,
	shared
} from "../modules";

export function handleOboDisabledForAll(event: OboDisabledForAll): void {
	shared.helpers.handleEvmMetadata(event)

	let owner = accounts.services.getOrCreateAccount(event.transaction.from)
	owner.save()

	let operator = accounts.services.getOrCreateAccount(event.params._operator)
	operator.save()

	let managerOwner = accounts.services.disableManagerOwner(
		owner.id,
		operator.id,
	)
	managerOwner.save()
}

export function handleOboApprovalForAll(event: OboApprovalForAll): void {
	shared.helpers.handleEvmMetadata(event)

	let owner = accounts.services.getOrCreateAccount(event.params._owner)
	owner.save()

	let operator = accounts.services.getOrCreateAccount(event.params._operator)
	operator.save()

	let managerOwner = accounts.services.getOrCreateManagerOwner(
		owner.id,
		operator.id,
		event.params._approved,
		event.transaction.hash.toHexString()
	)
	managerOwner.save()
}

export function handleUpdateDigitalMediaPrintIndexEvent(event: UpdateDigitalMediaPrintIndexEvent): void {
	shared.helpers.handleEvmMetadata(event)
	let digitalMedia = digitalMediaModule.updatePrintIndex(
		event.params.digitalMediaId.toHex(),
		event.params.printEdition
	)
	digitalMedia.save()
}

// * Either the _caller must be the _creator or the _caller must be the existing
// * approvedCreator.

export function handleChangedCreator(event: ChangedCreator): void {
	shared.helpers.handleEvmMetadata(event)
	let creatorAddress = event.params.creator
	let newCreatorAddress = event.params.newCreator
	let newCreator = accounts.services.getOrCreateAccount(newCreatorAddress)
	newCreator.save()
	let creator = accounts.services.changeApprovedCreator(
		creatorAddress,
		newCreator.id
	)
	creator.save()
}

export function handleDigitalMediaCollectionCreate(event: DigitalMediaCollectionCreateEvent): void {
	shared.helpers.handleEvmMetadata(event)

	let creator = accounts.services.getOrCreateAccount(event.params.creator)
	creator = accounts.helpers.increaseDigitalMediaCollectionsAmount(creator)
	creator.save()

	let collection = collections.getOrCreateDigitalMediaCollection(
		event.params.id.toHex(),
		event.params.creator.toHex(),
		event.params.storeContractAddress,
		event.params.metadataPath ,
	)
	collection.save()
}

export function handleDigitalMediaReleaseBurn(event: DigitalMediaReleaseBurnEvent): void {
	shared.helpers.handleEvmMetadata(event)
	let release = releases.burnToken(event.params.tokenId.toHex())
	release.owner = ADDRESS_ZERO
	release.save()
	let owner = accounts.services.burnDigitalMediaRelease(release.owner)
	owner.save()
}

export function handleDigitalMediaReleaseCreate(event: DigitalMediaReleaseCreateEvent): void {
	shared.helpers.handleEvmMetadata(event)
	let owner = accounts.services.getOrCreateAccount(event.params.owner)
	owner = accounts.helpers.increaseDigitalMediaReleasesAmount(owner)
	owner.save()

	let release = releases.getOrCreateDigitalMediaRelease(
		event.params.id.toHex(),
		owner.id,
		event.params.printEdition,
		event.params.tokenURI,
		event.params.digitalMediaId.toHex()
	)
	release.save()

}

export function handleDigitalMediaBurn(event: DigitalMediaBurnEvent): void {
	shared.helpers.handleEvmMetadata(event)
	let digitalMedia = digitalMediaModule.burnToken(
		event.params.id.toHex()
	)
	digitalMedia.save()
}

export function handleDigitalMediaCreate(event: DigitalMediaCreateEvent): void {
	shared.helpers.handleEvmMetadata(event)
	let creator = accounts.services.getOrCreateAccount(event.params.creator)
	creator = accounts.helpers.increaseDigitalMediaCreatedAmount(creator)
	creator.save()

	let digitalMedia = digitalMediaModule.getOrCreateDigitalMedia(
		event.params.id.toHex(),
		event.params.storeContractAddress,
		event.params.creator.toHex(),
		event.params.totalSupply,
		event.params.collectionId,
		event.params.printIndex,
		event.params.metadataPath
	)
	digitalMedia.save()
}

export function handleTransfer(event: Transfer): void {
	shared.helpers.handleEvmMetadata(event)
	// TODO: create the er721 transfer - evm transfer relationship
	let from = event.params._from.toHex()
	let to = event.params._to.toHex()
	let tokenId = event.params._tokenId.toHex()
	let blockNumber = event.block.number
	let blockId = blockNumber.toString()
	let timestamp = event.block.timestamp


	if (from == ADDRESS_ZERO) {
		transfer.handleMint(event.params._to, tokenId, timestamp, blockId)
	} else if (to == ADDRESS_ZERO) {
		transfer.handleBurn(event.params._from, tokenId, timestamp, blockId)
	} else {
		transfer.handleRegularTransfer(event.params._from, event.params._to, tokenId, timestamp, blockId)
	}

}

export function handleApproval(event: Approval): void {
	shared.helpers.handleEvmMetadata(event)
	let tokenId = event.params._tokenId.toHex()
	let ownerAddress = event.params._owner
	let approvedAddress = event.params._approved


	let approved = accounts.services.getOrCreateAccount(approvedAddress)
	approved = accounts.helpers.increaseApprovedTokenCount(approved)
	approved.save()

	let owner = accounts.services.getOrCreateAccount(ownerAddress)
	owner.save()

	let token = tokens.addApproval(tokenId, approvedAddress.toHex(), ownerAddress.toHex())
	token.save()
}

export function handleApprovalForAll(event: ApprovalForAll): void {
	shared.helpers.handleEvmMetadata(event)
	let ownerAddress = event.params._owner
	let operatorAddress = event.params._operator

	let owner = accounts.services.getOrCreateAccount(ownerAddress)
	owner.save()

	let operator = accounts.services.getOrCreateAccount(operatorAddress)
	operator.save()

	let operatorOwner = accounts.services.getOrCreateOperatorOwner(
		owner.id,
		operator.id,
		event.params._approved,
		event.transaction.hash.toHexString()
	)

	operatorOwner.save()

}
