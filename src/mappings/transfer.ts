import { BigInt, Bytes } from '@graphprotocol/graph-ts'
import {
	accounts,
	erc721Transactions,
	tokens
} from "../modules";

export namespace transfer {

	export function handleMint(to: Bytes, tokenId: string, timestamp: BigInt, blockId: string): void {
		let account = accounts.getOrCreateAccount(to)
		account.save()

		let token = tokens.mintToken(tokenId, to.toHex())
		token.save()

		let transaction = erc721Transactions.getNewMint(account.id, tokenId, timestamp, blockId)
		transaction.save()
	}


	export function handleBurn(from: Bytes, tokenId: string, timestamp: BigInt, blockId: string): void {

		let account = accounts.getOrCreateAccount(from)
		account.save()

		let token = tokens.burnToken(tokenId, from.toHex())
		token.save()

		let transaction = erc721Transactions.getNewBurn(account.id, tokenId, timestamp, blockId)
		transaction.save()
	}

	export function handleRegularTransfer(from: Bytes, to: Bytes, tokenId: string, timestamp: BigInt, blockId: string): void {

		let seller = accounts.getOrCreateAccount(from)
		seller.save()

		let buyer = accounts.getOrCreateAccount(to)
		buyer.save()

		let token = tokens.changeOwner(tokenId, buyer.id)
		token.save()

		let transaction = erc721Transactions.getNewTransfer(seller.id, buyer.id, tokenId, timestamp, blockId)
		transaction.save()
	}
}