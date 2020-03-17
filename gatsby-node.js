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
    name: "FEEDweave",
    description: `A decentralized social media application built on Arweave.`,
    github: `https://github.com/denisnazarov/feedweave-ui`,
    link: `https://feedweave.co/`,
  },
  {
    name: "permamail",
    description:
      "Weavemail is a prototype decentralised mail system. It runs on the Arweave network, so its messages and the web app itself are permanent and always available on the permaweb.",
    github: `https://github.com/ArweaveTeam/weavemail`,
    link: "https://weavemail.app/",
  },
  {
    name: "social-graph",
    description: `A social graph built on arweave. Allows one address to follow another address, optionally constraining the connection to an App via a filter.`,
    github: `coming soon`,
    link: `coming soon`,
  },
  {
    name: "identity-link",
    description: `Link an existing identity provider (e.g. Twitter) to your Arweave address.`,
    github: `coming soon`,
    link: `coming soon`,
  },
  {
    name: "neighbour-tweet",
    description: `Twitter-style-location-based permaweb platform`,
    github: `coming soon`,
    link: `coming soon`,
  },
  {
    name: "transaction-comment",
    description: `Post a comment on a transaction`,
    github: `coming soon`,
    link: `coming soon`,
  },
]

const fetchAppTransactions = appName =>
  axios.get(`https://gateway.arweave.co/transactions?app-name=${appName}`)

const fetchTransactions = async () => {
  const promises = APP_DATA.map(({ name }) => fetchAppTransactions(name))
  const results = await Promise.all(promises)
  const dataResults = results.map(result => result.data.transactions)
  return flatten(dataResults)
}

function ownerStats(ownerTxs) {
  const txsByAppName = groupBy(ownerTxs, "appName")
  const formatted = keys(txsByAppName).map(key => {
    return { appName: key, txs: txsByAppName[key] }
  })
  const sorted = formatted.sort((a, b) => {
    return b.txs.length - a.txs.length
  })

  const arweaveIdTxs = ownerTxs.filter(tx => tx.appName === "arweave-id")

  const arweaveIdNameTxs = arweaveIdTxs.filter(
    ({ tags }) =>
      tags.filter(({ name, value }) => name === "Type" && value === "name")
        .length > 0
  )
  const arweaveId = arweaveIdNameTxs[0] && arweaveIdNameTxs[0].content

  return {
    topApps: sorted
      .slice(0, 3)
      .map(({ appName, txs }) => ({ appName, txCount: txs.length })),
    arweaveId,
  }
}

exports.sourceNodes = async ({ actions }) => {
  const { createNode } = actions

  const transactions = await fetchTransactions()

  transactions.forEach((tx, i) => {
    const { id, blockHash, ownerAddress, content, appName, tags, fee } = tx

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
      order: i,
      fee: fee / 1000000000000,
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
              tags {
                name
                value
              }
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

  const appTxListTemplate = path.resolve("./src/templates/app-template.js")

  const userTxListTemplate = path.resolve("./src/templates/user-template.js")

  const txTemplate = path.resolve("./src/templates/tx-template.js")

  keys(transactionsByAppName).forEach(appName => {
    const appTxs = transactionsByAppName[appName]

    const txsPerPage = 5
    const numPages = Math.ceil(appTxs.length / txsPerPage)
    Array.from({ length: numPages }).forEach((_, i) => {
      createPage({
        path: i === 0 ? `/app/${appName}` : `/app/${appName}/${i + 1}`,
        component: appTxListTemplate,
        context: {
          appName: appName,
          limit: txsPerPage,
          skip: i * txsPerPage,
          numPages,
          currentPage: i + 1,
        },
      })
    })
  })

  keys(transactionsByOwner).forEach(address => {
    const ownerTxs = transactionsByOwner[address]
    const txsPerPage = 5
    const numPages = Math.ceil(ownerTxs.length / txsPerPage)
    Array.from({ length: numPages }).forEach((_, i) => {
      createPage({
        path: i === 0 ? `/address/${address}` : `/address/${address}/${i + 1}`,
        component: userTxListTemplate,
        context: {
          address,
          limit: txsPerPage,
          skip: i * txsPerPage,
          numPages,
          currentPage: i + 1,
          ownerStats: ownerStats(ownerTxs.map(({ node }) => node)),
        },
      })
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
