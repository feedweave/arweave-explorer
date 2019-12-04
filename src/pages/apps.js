import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"

const AppList = ({ data }) => {
  const { edges } = data.allArweaveApp

  return (
    <Layout>
      <h1>Arweave apps</h1>
      <ul>
        {edges.map(({ node: { name } }) => (
          <li key={name}>
            <Link to={`/app/${name}`}>{name}</Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export default AppList

export const pageQuery = graphql`
  query {
    allArweaveApp {
      totalCount
      edges {
        node {
          name
        }
      }
    }
  }
`
