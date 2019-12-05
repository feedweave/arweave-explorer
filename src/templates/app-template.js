import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import AppSummary from "../components/app-summary"
import TxTable from "../components/tx-table"
import Pagination from "../components/pagination"

function PaginationWrapper({ numPages, currentPage, appName }) {
  return (
    <Pagination
      currentPage={currentPage}
      numPages={numPages}
      prevLink={
        currentPage > 2
          ? `/app/${appName}/${currentPage - 1}`
          : `/app/${appName}`
      }
      nextLink={
        currentPage < numPages
          ? `/app/${appName}/${currentPage + 1}`
          : `/app/${appName}/${currentPage}`
      }
      firstLink={`/app/${appName}`}
      lastLink={`/app/${appName}/${numPages}`}
    />
  )
}

export default props => {
  const { data, pageContext } = props
  const { numPages, currentPage, appName } = pageContext
  const { edges: transactions } = data.allArweaveTransaction
  const appData = data.allArweaveApp.edges[0].node

  return (
    <Layout>
      <AppSummary {...appData} />
      <PaginationWrapper
        numPages={numPages}
        currentPage={currentPage}
        appName={appName}
      />
      <TxTable transactions={transactions} />
      <PaginationWrapper
        numPages={numPages}
        currentPage={currentPage}
        appName={appName}
      />
    </Layout>
  )
}

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
