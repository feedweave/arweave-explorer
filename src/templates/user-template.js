import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import TxTable from "../components/tx-table"
import Pagination from "../components/pagination"

function PaginationWrapper({ numPages, currentPage, address }) {
  return (
    <Pagination
      currentPage={currentPage}
      numPages={numPages}
      prevLink={
        currentPage > 2
          ? `/address/${address}/${currentPage - 1}`
          : `/address/${address}`
      }
      nextLink={
        currentPage < numPages
          ? `/address/${address}/${currentPage + 1}`
          : `/address/${address}/${currentPage}`
      }
      firstLink={`/address/${address}`}
      lastLink={`/address/${address}/${numPages}`}
    />
  )
}

export default props => {
  const { data, pageContext } = props
  const {
    numPages,
    currentPage,
    address,
    ownerStats: { topApps, arweaveId },
  } = pageContext
  const { edges: transactions, totalCount } = data.allArweaveTransaction

  return (
    <Layout>
      <h2>User address: {address}</h2>
      {arweaveId ? <h2>Arweave ID: {arweaveId}</h2> : null}
      <div>Transactions: {totalCount}</div>
      <div>Most active in:</div>
      <ol>
        {topApps.map(({ appName, txCount }) => (
          <li>
            <Link to={`/app/${appName}`}>{appName}</Link>: {txCount}{" "}
            transactions
          </li>
        ))}
      </ol>
      <PaginationWrapper
        numPages={numPages}
        currentPage={currentPage}
        address={address}
      />
      <TxTable transactions={transactions} />
      <PaginationWrapper
        numPages={numPages}
        currentPage={currentPage}
        address={address}
      />
    </Layout>
  )
}

export const pageQuery = graphql`
  query($address: String, $skip: Int!, $limit: Int!) {
    allArweaveTransaction(
      filter: { ownerAddress: { eq: $address } }
      sort: { fields: order, order: ASC }
      limit: $limit
      skip: $skip
    ) {
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
          fee
        }
      }
    }
  }
`
