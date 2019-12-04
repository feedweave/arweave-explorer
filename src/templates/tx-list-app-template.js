import { graphql } from "gatsby"
import TxList from "../components/tx-list"

export default TxList

export const pageQuery = graphql`
  query($appName: String) {
    allArweaveTransaction(filter: { appName: { eq: $appName } }) {
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
