import { ethereum } from "@graphprotocol/graph-ts";
import { blocks, transactions } from "../";

export namespace shared {
	export namespace helpers {
		export function handleEvmMetadata(event: ethereum.Event): void {
			let blockId = event.block.number.toString()
			let txHash = event.transaction.hash

			let block = blocks.services.getOrCreateBlock(blockId, event.block.timestamp, event.block.number)
			block.save()

			let transaction = transactions.getOrCreateTransactionMeta(
				txHash.toHexString(),
				blockId,
				txHash,
				event.transaction.from,
				event.transaction.gasUsed,
				event.transaction.gasPrice,
			)
			transaction.save()
		}
	}
}