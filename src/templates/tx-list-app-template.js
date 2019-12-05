import { graphql } from "gatsby"
import TxList from "../components/tx-list-page"

export default TxList

export const pageQuery = graphql`
  query($appName: String) {
    allArweaveApp(filter: { name: { eq: $appName } }) {
      edges {
        node {
          txCount
          userCount
          name
          github
          link
          description
        }
      }
    }
    allArweaveTransaction(filter: { appName: { eq: $appName } }) {
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
