# makers-place-subgraph
_Made by Protoire.io under MIT License_

"Create, sell and collect truly rare digital artworks. Powered by blockchain technology.."
 > https://makersplace.com/

This subgraph provide an standard erc-721 implementation, providing info about minting, transfer, bruning, approval. Additionally, this subgraph offers metadata about the evm actions such as Transaction and Block entities.

Also, this subgraph provides a lightweight approach to the Digital Media environment extending the standard erc-721 approach into a more board range without adding complexity.

This versión lacks of factory contract pattern support. Making it unable to track DigitalMedia as independent, pausable, single creator contracts but as an interface of an extended set of fungible and semi-fungible on top of a erc-721. By this reason, the pause, unpause, and singleCreator are not being indexed.

This subgraph index the contract "makers token v2" deployed on the following address:

	0x2a46f2ffd99e19a89476e2f62270e0a35bbf0756


## erc721Transaction

	Transfer(indexed address,indexed address,indexed uint256)

This interface provides useful information about basic Ercc-721 operations. 

Please see the TransactionMeta entity to get info about the chain's transactions

Relates to a "from" account, a "to" account, a block and a token. 

The transaction interface provides additional support trough the following entities:

	Mint, Burn, Transfer

```graphql
{
   Transactions
	   id
	   type
	   ...on Mint{
		   to {
			   address
		   }
	   }
	   ...on Burn{
		   form {
			   address
		   }
	   }
	   ...on Transfer{
		   from{
			   address
		   }
		   to{
			   address
		   }
	   }
   }
}
```
