# makers-place-subgraph
_Made by Protoire.io under MIT License_

"Create, sell and collect truly rare digital artworks. Powered by blockchain technology.."
 > https://makersplace.com/

This subgraph provide an standard erc-721 implementation, providing info about minting, transfer, bruning, approval. Additionally, this subgraph offers metadata about the evm actions such as Transaction and Block entities.

Also, this subgraph provides a lightweight approach to the Digital Media environment extending the standard erc-721 approach into a more board range without adding complexity.

This versión lacks of factory contract pattern support. Making it unable to track DigitalMedia as independent, pausable, single creator contracts but as an interface of an extended set of fungible and semi-fungible on top of a erc-721. By this reason, the pause, unpause, and singleCreator are not being indexed.

This subgraph index the contract "makers token v2" deployed on the following address:

	0x2a46f2ffd99e19a89476e2f62270e0a35bbf0756

# Erc721 support

This section provides an overview of the standard erc721 support to makersplace.

## erc721Transactions

	Transfer(indexed address,indexed address,indexed uint256)

This interface provides useful information about basic Ercc-721 operations. 

Please see the TransactionMeta entity to get info about the chain's transactions

Relates to a "from" account, a "to" account, a block and a token. 

The transaction interface provides additional support trough the following entities:

	Mint, Burn, Transfer

```graphql
{
   TokenTransactions(first:20)
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


## OperatorOwner

	ApprovalForAll(indexed address,indexed address,bool)

In order to support "approval for all" Accounts are related as "many to many" using the OperatorOwner entity.

```graphql
# working with Transactions
{
	operatorOwners(first:20){
		approved
		owner{
			address
		}
		operator{
			address
		}
		transaction{
			hash
			block{
				number
			}
		}
	}
}

```

## Token

	Generated(indexed uint256,indexed address,string)

The Token entity provides an standard erc-721 token interface wich also holds the uri, an string representation of the nft's art.

```graphql
# working with Transactions
{
	tokens(first:20){
		approval{
			address
		}
	}
}
```
# Evm metadata

This sections offers a view into the support for evm block and transactions

## Block

This entity loaded/created on each handler, the propourse is to provide a minimum way to index and present data over time. 

```graphql
{
	blocks(first:20){
	timestamp
	number
	erc721TransactionsCount
	erc721Transactions(first:2){
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

## Transaction 

This entity is created paired w/ the blocks entity and is intended to provide a more detaileed entity for the time series indexation.

```graphql
{
	transactions(first:20){
		hash
		gasUsed
		block{
			timestamp
		}
	}
}
```

# Digital media

Here's where maker'splace core features are described.

As the dynamic data-template pattern wasn't used, this subgraph doesn't index follwing events:


	- Pause()
	- Unpause()
	- SingleCreatorChanged(indexed address,indexed address)
 
## DigitalMediaCollection

	- DigitalMediaCollectionCreateEvent(uint256,address,address,string)

The digital media collection provides an entity to store the collection and related digital media entities.


```graphql
{
	digitalMediaCollections(first:20){
		creator {
			address
		}
		digitalMediaAmount
		digitalMedia{
			storeContractAddress
		}
	}
}
```

## DigitalMedia

    - event: DigitalMediaCreateEvent(uint256,address,address,uint32,uint32,uint256,string)

This entity provides a way to store the first class citizen of this project, a non fungible token. The digital Media entity provides info about the art creation itself and relates to it's current owner, collection, and so on.


```graphql
{
	digitalMedias(first: 20){
		creator {
			address
		}
		collection {
			metadataPath
		}
		releases(first: 5) {
			tokenURI
		}
		metadataPath
		totalSupply
	}
}
```

## Digital Media Release

	- event: DigitalMediaReleaseCreateEvent(uint256,address,uint32,string,uint256)

This entitiy stores the semi fungible tokens related to the DigitalMedia entity.


```graphql
{
	digitalMediaReleases(first: 20){
		creator {
			address
		}
		digitalMedia {
			collection {
				metadataPath
			}
			metadataPath
		}
		printEdition
		tokenUri
	}
}
```