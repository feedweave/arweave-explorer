import React from "react"
import Layout from "./layout"
import AppSummary from "./app-summary"
import TxTable from "./tx-table"
import Pagination from "./pagination"

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
          : `/app/${appName}`
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
