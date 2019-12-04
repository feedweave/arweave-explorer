import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
// import TxDetail from "../components/tx-detail"

export default ({ pageContext, data }) => {
  const node = data.allArweaveTransaction.edges[0].node
  return <Layout>{/* <TxDetail node={node} /> */}</Layout>
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
        }
      }
    }
  }
`
