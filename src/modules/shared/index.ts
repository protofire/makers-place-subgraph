import { ethereum } from "@graphprotocol/graph-ts";
import { blocks, transactions } from "../";

export namespace shared {
	export namespace helpers {
		export function handleEvmMetadata(event: ethereum.Event): void {
			let blockNumber = event.block.number
			let blockId = blockNumber.toString()
			let txHash = event.transaction.hash
			let timestamp = event.block.timestamp

			let block = blocks.services.getOrCreateBlock(blockId, timestamp, blockNumber)
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