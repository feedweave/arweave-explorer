import React from "react"
import { Link } from "gatsby"

import appListStyles from "./app-list.module.css"

function AppItem({ name, userCount, txCount }) {
  return (
    <Link to={`/app/${name}`}>
      <div className={appListStyles.itemContainer}>
        <div className={appListStyles.itemName}>{name}</div>
        <div className={appListStyles.itemData}>
          <div>Transactions: {txCount}</div>
          <div>Users: {userCount}</div>
        </div>
      </div>
    </Link>
  )
}

export default function AppList({ apps }) {
  return (
    <ul className={appListStyles.container}>
      {apps.map(({ node: { name, userCount, txCount } }) => (
        <li key={name}>
          <AppItem name={name} userCount={userCount} txCount={txCount} />
        </li>
      ))}
    </ul>
  )
}
