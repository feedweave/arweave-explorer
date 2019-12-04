import { graphql } from "gatsby"
import TxList from "../components/tx-list-page"

export default TxList

export const pageQuery = graphql`
  query($appName: String, $address: String) {
    allArweaveTransaction(
      filter: { appName: { eq: $appName }, ownerAddress: { eq: $address } }
    ) {
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
