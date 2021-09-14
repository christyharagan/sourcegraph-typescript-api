import { GitHubConnection } from './github_schema'
import { make_request, SGCreds } from './request'
import { FetchAllEvents, FETCH_ALL_EVENTS, GetExternalServices, GET_EXTERNAL_SERVICES, get_repo_permission_sync, RepositoryPermissionSync, schedule_repo_sync, update_external_service } from './schema'

export type Credentials = SGCreds

export async function add_github_repositories(creds: SGCreds, code_host_id: string, repos: string[]) {
  const config = await get_github_config(creds, code_host_id)
  if (!config.repos) {
    config.repos = []
  }
  const rs = config.repos
  repos.forEach(repo => {
    if (rs.find(r => repo == r)) {
      throw new Error(`Repository already exists in code host with id ${code_host_id}`)
    }
    rs.push(repo)
  })
  await update_code_host_config(creds, code_host_id, config)
}

export async function remove_github_repositories(creds: SGCreds, code_host_id: string, repos: string[]) {
  const config = await get_github_config(creds, code_host_id)
  if (!config.repos) {
    throw new Error(`Repository does not exist in code host with id ${code_host_id}`)
  }
  const rs = config.repos
  repos.forEach(repo => {
    const i = rs.indexOf(repo)
    if (i == -1) {
      throw new Error(`Repository does not exist in code host with id ${code_host_id}`)
    }
    rs.splice(i, 1)
  })
  await update_code_host_config(creds, code_host_id, config)
}

export async function sync_repo(creds: SGCreds, host_domain: string, repo_name: string) {
  return await make_request(creds, schedule_repo_sync(host_domain, repo_name))
}

export async function has_repo_permissions_synced(creds: SGCreds, host_domain: string, repo_name: string) {
  const r = await make_request<RepositoryPermissionSync>(creds, get_repo_permission_sync(host_domain, repo_name))
  return r.data.repository.permissionsInfo != null
}

export async function get_code_host_id(creds: SGCreds, host_name: string) {
  const scs = await get_external_services(creds)
  const es = scs.find(node => node.displayName == host_name)
  if (!es) {
    throw new Error('Cannot find code host with display name: ' + host_name)
  }
  return es.id
}

export async function get_github_config(creds: SGCreds, code_host_id: string) {
  return get_code_host_config(creds, code_host_id) as Promise<GitHubConnection>
}

export async function get_github_configs(creds: SGCreds, code_host_ids: string[]) {
  return get_code_host_configs(creds, code_host_ids) as Promise<{ [id: string]: GitHubConnection }>
}

export async function get_external_services(creds: SGCreds) {
  const scs = await make_request<GetExternalServices>(creds, GET_EXTERNAL_SERVICES)
  return scs.data.externalServices.nodes
}

export async function get_code_host_config(creds: SGCreds, code_host_id: string) {
  const scs = await get_external_services(creds)
  const s = scs.find(node => node.id == code_host_id)
  if (!s) {
    throw new Error('Code host not found: ' + code_host_id)
  }
  return JSON.parse(s.config)
}

export async function get_code_host_configs(creds: SGCreds, code_host_ids: string[]) {
  const scs = await get_external_services(creds)
  const configs: { [id: string]: any } = {}
  const unfound: { [name: string]: true } = {}
  code_host_ids.forEach(n => {
    unfound[n] = true
  })
  scs.forEach(node => {
    if (unfound[node.id]) {
      delete unfound[node.id]
      configs[node.id] = JSON.parse(node.config)
    }
  })
  if (Object.keys(unfound).length > 0) {
    throw new Error('Code hosts not found: ' + JSON.stringify(Object.keys(unfound)))
  }
  return configs
}

export async function update_code_host_config(creds: SGCreds, code_host_id: string, config: any) {
  return await make_request(creds, update_external_service(code_host_id, JSON.stringify(config)))
}

export async function find_users_who_accessed_repos(creds: SGCreds, repos: string[]) {
  const events = await fetch_all_events(creds)
  const users = events.data.users.nodes.filter(u => u.eventLogs.nodes.find(e => repos.find(repo => e.url.toLowerCase().indexOf(repo.toLowerCase()) != -1)))
  return users ? users.map(u => u.emails.map(e => e.email)) : []
}

export async function fetch_all_events(creds: SGCreds) {
  return await make_request<FetchAllEvents>(creds, FETCH_ALL_EVENTS)
}