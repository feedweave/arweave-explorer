import { graphql } from "gatsby"
import TxList from "../components/tx-list-page"

export default TxList

export const pageQuery = graphql`
  query($address: String) {
    allArweaveTransaction(filter: { ownerAddress: { eq: $address } }) {
      totalCount
      edges {
        node {
          id
          ownerAddress
          blockHash
          content
        }
      }
    }
  }
`
