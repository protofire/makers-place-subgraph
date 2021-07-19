import { ADDRESS_ZERO } from '@protofire/subgraph-toolkit'
import {
	Approval,
	ApprovalForAll,
	Transfer
} from "../../generated/makersplace/makerstokenv2";

import { transfer } from "./transfer"

import {
	tokens,
	accounts,
	blocks,
	transactionsMeta
} from "../modules";

export * from "./digitalMedia"



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
