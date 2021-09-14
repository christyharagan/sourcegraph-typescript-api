import { Credentials, get_code_host_id, add_github_repositories } from '.'

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