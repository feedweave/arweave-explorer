import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import { TxHeader, TxDetail } from "../components/tx-table"

export default ({ pageContext, data }) => {
  const node = data.allArweaveTransaction.edges[0].node
  return (
    <Layout>
      <h2>Transaction: {node.id}</h2>
      <TxHeader />
      <TxDetail node={node} expanded={true} />
    </Layout>
  )
}

export const pageQuery = graphql`
  query($txId: String) {
    allArweaveTransaction(filter: { id: { eq: $txId } }) {
      totalCount
      edges {
        node {
          id
          ownerAddress
          blockHash
          content
          tags {
            name
            value
          }
        }
      }
    }
  }
`
