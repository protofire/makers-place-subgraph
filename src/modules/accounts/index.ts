import { Bytes } from '@graphprotocol/graph-ts';
import { integer } from '@protofire/subgraph-toolkit';
import { Account, OperatorOwner } from '../../../generated/schema'

export namespace accounts {

	export namespace services {
		export function getOrCreateAccount(accountAddress: Bytes): Account {
			let accountId = accountAddress.toHex()

			let account = Account.load(accountId)
			if (account == null) {
				account = new Account(accountId)
				account.address = accountAddress
			}
			return account as Account
		}


		export function getOrCreateOperatorOwner(
			ownerId: string, operatorId: string,
			approved: boolean
		): OperatorOwner {
			let operatorOwnerId = helpers.getOperatorOwnerId(ownerId, operatorId)
			let operatorOwner = OperatorOwner.load(operatorOwnerId)
			if (operatorOwner == null) {
				operatorOwner = new OperatorOwner(operatorOwnerId)
				operatorOwner.owner = ownerId
				operatorOwner.operator = operatorId
			}
			operatorOwner.approved = approved
			return operatorOwner as OperatorOwner
		}

		export function changeApprovedCreator(
			creatorAddress: Bytes,
			newCreatorId: string
		): Account {
			let creator = getOrCreateAccount(creatorAddress)
			creator.approvedCreator = newCreatorId
			return creator as Account
		}
	}
	export namespace helpers {

		export function increaseSentTransactionsCount(entity: Account): Account {
			entity.tokensAmount = entity.sentTransactionsAmount.plus(integer.ONE)
			return entity as Account
		}

		export function increaseApprovedTokenCount(entity: Account): Account {
			entity.tokensAmount = entity.approvedTokensAmount.plus(integer.ONE)
			return entity as Account
		}

		export function increaseTokenCount(entity: Account): Account {
			entity.tokensAmount = entity.tokensAmount.plus(integer.ONE)
			return entity as Account
		}

		export function decreaseTokenCount(entity: Account): Account {
			entity.tokensAmount = entity.tokensAmount.minus(integer.ONE)
			return entity as Account
		}

		export function getOperatorOwnerId(
			ownerId: string,
			operatorId: string
		): string {
			return ownerId.concat("-".concat(operatorId))
		}

	}


}