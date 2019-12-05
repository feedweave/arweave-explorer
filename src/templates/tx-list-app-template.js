import { graphql } from "gatsby"
import TxList from "../components/tx-list-page"

export default TxList

export const pageQuery = graphql`
  query($appName: String, $skip: Int!, $limit: Int!) {
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
    allArweaveTransaction(
      sort: { fields: order, order: ASC }
      filter: { appName: { eq: $appName } }
      limit: $limit
      skip: $skip
    ) {
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
          fee
        }
      }
    }
  }
`
