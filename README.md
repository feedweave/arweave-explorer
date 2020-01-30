# arweave-explorer

A block explorer for Arweave apps. Filters blockchain transaction by `App-Name` tag and compute somes simple analytics for each.

Also supports seeing transactions by wallet address. Renders a user's [ArweaveID](https://github.com/shenwilly/arweaveID) if they have set one up. 

Implemented as a statically generated site, hosted on Netlify. A site build is triggered when a new transaction with one of the watched tags is seen on the blockchain.

Data ingested via https://gateway.arweave.co. See the gateway code [here](https://github.com/denisnazarov/arweave-gateway).
