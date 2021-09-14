# Sourcegraph TypeScript API

Various useful functions for interacting with [Sourcegraph](https://sourcegraph.com) via its API.

The helper functions are found under ```index.ts``` whilst some examples are found under ```examples.ts```.

## Instructions

First add this as a dependency to your project:

```npm i --save sourcegraph-typescript-api```

A TypeScript example:

```ts
import { Credentials, get_code_host_id, add_github_repositories } from 'sourcegraph-typescript-api'

const creds: Credentials = {
  sg_host: 'https://my-sg-domain',
  sg_token: 'MY-API-ACCESS-TOKEN'
}

get_code_host_id(creds, 'MY-CODE-HOST-NAME').then(code_host_id => {
  return add_github_repositories(creds, code_host_id, ['REPO_A', 'REPO_B'])
}).then(() => {
  console.log('Repos added successfully!')
}).catch(e => {
  console.error(e)
})
```

A JavaScript example:

```js
const { get_code_host_id, add_github_repositories } = require('sourcegraph-typescript-api')

const creds = {
  sg_host: 'https://my-sg-domain',
  sg_token: 'MY-API-ACCESS-TOKEN'
}

get_code_host_id(creds, 'MY-CODE-HOST-NAME').then(code_host_id => {
  return add_github_repositories(creds, code_host_id, ['REPO_A', 'REPO_B'])
}).then(() => {
  console.log('Repos added successfully!')
}).catch(e => {
  console.error(e)
})
```