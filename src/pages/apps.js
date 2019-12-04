import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import AppList from "../components/app-list"

import appStyles from "./apps.module.css"

const Apps = ({ data }) => {
  const { edges } = data.allArweaveApp

  return (
    <Layout>
      <div className={appStyles.container}>
        <h2>Featured apps</h2>
        <AppList apps={edges} />
      </div>
    </Layout>
  )
}

export default Apps

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
