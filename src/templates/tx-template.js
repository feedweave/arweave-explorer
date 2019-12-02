import React from "react"
import { graphql } from "gatsby"
import Tx from "../components/tx"

export default ({ pageContext, data }) => {
  const node = data.allArweaveTransaction.edges[0].node
  return <Tx node={node} />
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
