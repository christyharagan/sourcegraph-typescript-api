import { Credentials, get_code_host_id, add_github_repositories, list_all_repos, find_matching_branches, git_blame } from '.'

const creds: Credentials = {
  sg_host: 'https://MY-SG-DOMAIN',
  sg_token: 'MY-ACCESS-TOKEN'
}

// Add repositories to a code-host
get_code_host_id(creds, 'MY-CODE-HOST-NAME').then(code_host_id => {
  return add_github_repositories(creds, code_host_id, ['REPO_A', 'REPO_B'])
}).then(() => {
  console.log('Repos added successfully!')
}).catch(e => {
  console.error(e)
})

// Find all branches and commits where 'TODO' was added across every repo
list_all_repos(creds).then(repos => {
  repos.forEach(r => {
    git_blame(creds, r, `TODO`).then(rr => {
      console.log('Results for repository: ' + r)
      console.log('==========')
      console.log('Matching branches:')
      console.log('----------')
      rr.repos_and_branches[r].forEach(branch => {
        console.log('  ' + branch)
      })
      console.log('Matching commits:')
      console.log('----------')
      rr.commits.forEach(c => {
        console.log('  commit: ' + c.id + '  on date: ' + c.date + '  by person: <' + c.person.name + '>' + c.person.email)
      })
    })
  })
})