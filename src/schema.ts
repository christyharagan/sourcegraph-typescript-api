export type RunSearchErrorResponse = {
  errors: { message: string, locations: { line: number, column: number }[] }[]
}

export function search(query: string) {
  return `query {
  search(query: "${query}") {
    results {
      matchCount
    }
  }
}`
}

export const GET_EXTERNAL_SERVICES = `query {
  externalServices {
    nodes {
      id
      displayName
      config
    }
  }
}`

export function update_external_service(id: string, config: string) {
  const config_str = JSON.stringify({ config })
  const pre = '{"config"'
  const config_strip_end = config_str.substring(0, config_str.length - 1)
  const config_strip_start = config_strip_end.substring(pre.length)
  return `mutation Update {
  updateExternalService(id: "${id}", config: ${config_strip_start}) {
    updatedAt
  }
}`
}

export function schedule_repo_sync(host_domain: string, repo_name: string) {
  return `mutation Check {
  scheduleRepositoryPermissionsSync(repository: "${host_domain}/${repo_name}") {
    alwaysNil
  }
}`
}

export function get_repo_permission_sync(host_domain: string, repo_name: string) {
  return `query {
  repository(name: "${host_domain}/${repo_name}") {
    permissionsInfo {
			syncedAt
    }
	}
}`
}

export type RepositoryPermissionSync = {
  data: {
    repository: {
      permissionsInfo: string | null
    }
  }
}

export type GetExternalServices = {
  data: {
    externalServices: {
      nodes: {
        id: string
        displayName: string
        config: string
      }[]
    }
  }
}

export const FETCH_ALL_EVENTS = `
query {
  users(activePeriod: ALL_TIME) {
    nodes {
      emails  {
        email
      }
      username
      eventLogs {
        nodes{
          name
         url
        }
      }
    }
  }
}`

export type FetchAllEvents = {
  data: {
    users: {
      nodes: {
        eventLogs: {
          nodes: {
            name: string
            url: string
          }[]
        }
        emails: {
          email: string
        }[]
        username: string
      }[]
    }
  }
}