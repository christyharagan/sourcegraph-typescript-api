export type RunSearchErrorResponse = {
  errors: { message: string, locations: { line: number, column: number }[] }[]
}

function sanitise_query(query: string) {
  return JSON.stringify({ query }).replace('{"query"', '{query')
}

export function delete_code_monitor(monitor_id: string) {
  return `mutation DeleteMonitor {
  deleteCodeMonitor(id: "${monitor_id}") {
		alwaysNil
  }
}`
}

export function get_user_code_monitors(by: 'username' | 'email', value: string) {
  return `query {
  user(${by}: "${value}") {
    monitors {
      nodes {
        description
        trigger {
          ... on MonitorQuery {
          	query
        	}
        }
        actions {
          nodes {
            ... on MonitorEmail {
              header
              recipients {
                nodes {
                  id
                  namespaceName
								}
              }
            }
          }
        }
      }
    }
  }
}`
}

export type GetUserCodeMonitors = {
  data: {
    user: {
      monitors: {
        nodes: {
          description: string
          trigger: {
            query: string
          }
          actions: {
            nodes: {
              header: string
              recipients: {
                nodes: {
                  id: string
                  namespaceName: string
                }[]
              }
            }[]
          }
        }[]
      }
    }
  }
}

export function create_code_monitor(user_or_org_id: string, description: string, enabled: boolean, query: string, email_header?: string) {
  return `mutation CreateMonitor {
  createCodeMonitor(
    monitor: {
    	namespace: "${user_or_org_id}",
    	description: "${description}", 
    	enabled: ${enabled}}, 
    trigger: {${sanitise_query(query)}},
    actions: [{email:{
      enabled: true, 
      priority: NORMAL, 
      recipients:["${user_or_org_id}"], 
      header: "${email_header || ''}"
    }}]
  ) {
		id
  }
}`
}

export type CreateCodeMonitor = {
  data: {
    createCodeMonitor: {
      id: string
    }
  }
}

export function get_user_id(by: 'username' | 'email', value: string) {
  return `query {
  user(${by}: "${value}") {
    id
  }
}`
}

export type GetUserId = {
  data: {
    user: {
      id: string
    }
  }
}

export function get_defs_or_refs(repo: string, commit: string, path: string, line: string, character: string, defs_or_refs: 'definitions' | 'references') {
  return `query DefinitionAndHover {
  repository(name: "${repo}") {
    commit(rev: "${commit}") {
      blob(path: "${path}") {
        lsif {
          ${defs_or_refs}(line: ${line}, character: ${character}) {
            nodes {
              url
              resource {
                path
                repository {
                  name
                }
                commit {
                  abbreviatedOID
                  oid
                }
              }
              range {
                start {
                  line
                  character
                }
                end {
                  line
                  character
                }
              }
            }
          }
        }
      }
    }
  }
}`
}

export type GetDefsOrRefs<DefsOrRefs extends 'definitions' | 'references'> = {
  data: {
    repository: {
      commit: {
        blob: {
          lsif: {
            [prop in DefsOrRefs]: {
              nodes: {
                url: string
                resource: {
                  path: string
                  repository: {
                    name: string
                  }
                  commit: {
                    oid: string
                    abbreviatedOID: string
                  }
                }
                range: {
                  start: {
                    line: number
                    character: number
                  }
                  end: {
                    line: number
                    character: number
                  }
                }
              }[]
            }
          }
        }
      }
    }
  }
}

export const LIST_ALL_REPOS = `query {
  search(query: "type:repo") {
    results {
      repositories {
        name
      }
   }
 }
}`

export type ListAllRepos = {
  data: {
    search: {
      results: {
        repositories: {
          name: string
        }[]
      }
    }
  }
}

export function git_blame(repo: string, query: string) {
  return `query {
  search(${sanitise_query(query + `repo:${repo}@*refs/heads/* type:diff select:commit.diff.added`)}) {
    results {
      results {
        ... on CommitSearchResult {
          commit {
            abbreviatedOID
            author {
              date
              person {
                name
                email
              }
            }
          }
      	}
      }
      repositories {
        branches {
          nodes {
            name
          }
        }
        name
      }
    }
  }
}`
}

export type GitBlame = {
  data: {
    search: {
      results: {
        results: {
          commit: {
            abbreviatedOID: string,
            author: {
              date: string,
              person: {
                name: string,
                email: string
              }
            }
          }
        }[]
        repositories: {
          branches: {
            nodes: {
              name: string
            }[]
          },
          name: string
        }[]
      }
    }
  }
}

export function list_matching_branches(repo: string, query: string) {
  return `query {
  search(${sanitise_query(query + ` repo:${repo}@*refs/heads/*`)}) {
    results {
      repositories {
        branches {
          nodes {
            name
          }
        }
        name
      }
    }
  }
}`
}

export type ListMatchingBranches = {
  data: {
    search: {
      results: {
        repositories: {
          branches: {
            nodes: {
              name: string
            }[]
          },
          name: string
        }[]
      }
    }
  }
}

export function count_search(query: string) {
  return `query {
  search(${sanitise_query(query)}) {
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
  const pre = '{config'
  const config_strip_end = config_str.substring(0, config_str.length - 1)
  const config_strip_start = config_strip_end.substring(pre.length)
  return `mutation Update {
  updateExternalService(id: "${id}", config: "${config_strip_start}") {
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