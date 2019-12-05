import React from "react"
import Layout from "./layout"
import AppSummary from "./app-summary"
import TxTable from "./tx-table"

const appSummaryPlaceholder = {
  appDescription: `Discussion board for Arweave.

Arweave ÐApp (decentralized application) as a platform for discussions and knowledge base. Decentralized, impartial, data protection compliant. Managed by users. No backend, no cookies, no worries. Pure Arweave.`,
  transactionCount: `254`,
  userCount: `14`,
  gitHubLink: `https://github.com/sergejmueller/arboard`,
  appLink: `https://arweave.net/pvmiu4SZKQGWAYjrLWzE_mI70u1-v8zIzQ8WaxIYURk`,
}

export default props => {
  const { data } = props
  const { edges: transactions } = data.allArweaveTransaction
  const appData = data.allArweaveApp.edges[0].node

  return (
    <Layout>
      <AppSummary {...appData} />
      <TxTable transactions={transactions} />
    </Layout>
  )
}
