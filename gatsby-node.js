const path = require("path")

const axios = require("axios")
const crypto = require("crypto")

const groupBy = require("lodash/groupBy")
const keys = require("lodash/keys")
const flatten = require("lodash/flatten")

const APP_NAMES = [
  "ArBoard",
  "arweave-id",
  "Academic",
  "arweave-blog-0.0.1",
  "permamail",
]

const fetchAppTransactions = appName =>
  axios.get(`https://gateway.arweave.co/transactions/app-name/${appName}`)

const fetchTransactions = async () => {
  const promises = APP_NAMES.map(name => fetchAppTransactions(name))
  const results = await Promise.all(promises)
  const dataResults = results.map(result => result.data)
  return flatten(dataResults)
}

exports.sourceNodes = async ({ actions }) => {
  const { createNode } = actions

  const transactions = await fetchTransactions()

  transactions.forEach((tx, i) => {
    const { id, blockHash, ownerAddress, content, appName } = tx

    const transactionNode = {
      id,
      parent: `__SOURCE__`,
      internal: {
        type: `ArweaveTransaction`,
      },
      children: [],
      blockHash,
      ownerAddress,
      content,
      appName,
    }

    const contentDigest = crypto
      .createHash(`md5`)
      .update(JSON.stringify(transactionNode))
      .digest(`hex`)

    transactionNode.internal.contentDigest = contentDigest
    createNode(transactionNode)
  })

  APP_NAMES.forEach((name, i) => {
    const appNode = {
      id: name,
      parent: `__SOURCE__`,
      internal: {
        type: `ArweaveApp`,
      },
      children: [],
      name,
    }

    const contentDigest = crypto
      .createHash(`md5`)
      .update(JSON.stringify(name))
      .digest(`hex`)

    appNode.internal.contentDigest = contentDigest
    createNode(appNode)
  })

  return
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  const result = await graphql(
    `
      {
        transactions: allArweaveTransaction {
          edges {
            node {
              id
              blockHash
              ownerAddress
              appName
              content
            }
          }
        }
      }
    `
  )
  const transactions = result.data.transactions.edges
  const transactionsByOwner = groupBy(
    transactions,
    transaction => transaction.node.ownerAddress
  )
  const transactionsByAppName = groupBy(
    transactions,
    transaction => transaction.node.appName
  )

  let transactionsByAppNameAndOwner = {}
  keys(transactionsByAppName).forEach(key => {
    transactionsByAppNameAndOwner[key] = groupBy(
      transactionsByAppName[key],
      transaction => transaction.node.ownerAddress
    )
  })

  // - /apps ✅
  // - /app/:app-name ✅
  // - /app/:app-name/address/:address ✅
  // - /address/:address ✅
  // - /transaction/:id ✅

  const appTxListTemplate = path.resolve(
    "./src/templates/tx-list-app-template.js"
  )
  const appUserTxListTemplate = path.resolve(
    "./src/templates/tx-list-app-user-template.js"
  )
  const userTxListTemplate = path.resolve(
    "./src/templates/tx-list-app-user-template.js"
  )
  const txTemplate = path.resolve("./src/templates/tx-template.js")

  keys(transactionsByAppName).forEach(appName => {
    createPage({
      path: `/app/${appName}`,
      component: appTxListTemplate,
      context: {
        appName: appName,
      },
    })
  })

  keys(transactionsByAppNameAndOwner).forEach(appName => {
    keys(transactionsByAppNameAndOwner[appName]).forEach(owner => {
      createPage({
        path: `/app/${appName}/address/${owner}`,
        component: appUserTxListTemplate,
        context: {
          appName: appName,
          address: owner,
        },
      })
    })
  })

  keys(transactionsByOwner).forEach(address => {
    createPage({
      path: `/address/${address}`,
      component: userTxListTemplate,
      context: { address },
    })
  })

  transactions.forEach(({ node: { id } }) => {
    createPage({
      path: `/transaction/${id}`,
      component: txTemplate,
      context: { txId: id },
    })
  })
}
