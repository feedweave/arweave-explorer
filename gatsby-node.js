const path = require("path")

const axios = require("axios")
const crypto = require("crypto")

const groupBy = require("lodash/groupBy")
const keys = require("lodash/keys")
const flatten = require("lodash/flatten")

const APP_DATA = [
  {
    name: "ArBoard",
    description: `Discussion board for Arweave.

Arweave ÐApp (decentralized application) as a platform for discussions and knowledge base. Decentralized, impartial, data protection compliant. Managed by users. No backend, no cookies, no worries. Pure Arweave.`,
    github: `https://github.com/sergejmueller/arboard`,
    link: `https://arweave.net/pvmiu4SZKQGWAYjrLWzE_mI70u1-v8zIzQ8WaxIYURk`,
  },
  {
    name: "arweave-id",
    description: `An identity registry for Arweave addresses.`,
    github: `https://github.com/shenwilly/arweaveID/`,
    link: `https://arweave.net/fGUdNmXFmflBMGI2f9vD7KzsrAc1s1USQgQLgAVT0W0`,
  },
  {
    name: "Academic",
    description: `High-quality Open Access publishing

Arweave ÐApp for publishing academic articles which are freely available for anyone in the world to use.

Be a part of the academic community, submit publications on ArAcademic under a Creative Commons license or under Open Access, original work under a CC BY-NC 4.0 license.

All submitted publications can be read by everyone. An Arweave Wallet is required for writing articles.`,
    github: `https://github.com/sergejmueller/aracademic`,
    link: `https://ss6puabcq3ch.arweave.net/5Yeg3wT4COQL6Bz-tdp9xlmeiwgcOO8NupjpEUDXZ5Y/index.html`,
  },
  {
    name: "arweave-blog-0.0.1",
    description: `A blogging platform built on arweave`,
    github: `coming soon`,
    link: `coming soon`,
  },
  {
    name: "permamail",
    description:
      "Weavemail is a prototype decentralised mail system. It runs on the Arweave network, so its messages and the web app itself are permanent and always available on the permaweb.",
    github: `https://github.com/ArweaveTeam/weavemail`,
    link: "https://weavemail.app/",
  },
]

const fetchAppTransactions = appName =>
  axios.get(`https://gateway.arweave.co/transactions/app-name/${appName}`)

const fetchTransactions = async () => {
  const promises = APP_DATA.map(({ name }) => fetchAppTransactions(name))
  const results = await Promise.all(promises)
  const dataResults = results.map(result => result.data)
  return flatten(dataResults)
}

exports.sourceNodes = async ({ actions }) => {
  const { createNode } = actions

  const transactions = await fetchTransactions()

  transactions.forEach((tx, i) => {
    const { id, blockHash, ownerAddress, content, appName, tags } = tx

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
      tags,
    }

    const contentDigest = crypto
      .createHash(`md5`)
      .update(JSON.stringify(transactionNode))
      .digest(`hex`)

    transactionNode.internal.contentDigest = contentDigest
    createNode(transactionNode)
  })

  const txByApp = groupBy(transactions, "appName")

  APP_DATA.forEach((app, i) => {
    const { name, description, github, link } = app
    const appNode = {
      id: name,
      parent: `__SOURCE__`,
      internal: {
        type: `ArweaveApp`,
      },
      children: [],
      name,
      description,
      github,
      link,
      txCount: txByApp[name].length,
      userCount: keys(groupBy(txByApp[name], "ownerAddress")).length,
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
