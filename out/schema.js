"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FETCH_ALL_EVENTS = exports.get_repo_permission_sync = exports.schedule_repo_sync = exports.update_external_service = exports.GET_EXTERNAL_SERVICES = exports.count_search = exports.list_matching_branches = exports.git_blame = exports.LIST_ALL_REPOS = exports.get_defs_or_refs = exports.get_user_id = exports.create_code_monitor = exports.get_user_code_monitors = exports.get_users = exports.delete_code_monitor = void 0;
function sanitise_query(query) {
    return JSON.stringify({ query }).replace('{"query"', '{query');
}
function delete_code_monitor(monitor_id) {
    return `mutation DeleteMonitor {
  deleteCodeMonitor(id: "${monitor_id}") {
		alwaysNil
  }
}`;
}
exports.delete_code_monitor = delete_code_monitor;
function get_users() {
    return `query {
  users {
    nodes {
      id
      username
      displayName
      siteAdmin
      emails {
        email
      }
		}
  }
}`;
}
exports.get_users = get_users;
function get_user_code_monitors(by, value) {
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
}`;
}
exports.get_user_code_monitors = get_user_code_monitors;
function create_code_monitor(user_or_org_id, description, enabled, query, email_header) {
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
}`;
}
exports.create_code_monitor = create_code_monitor;
function get_user_id(by, value) {
    return `query {
  user(${by}: "${value}") {
    id
  }
}`;
}
exports.get_user_id = get_user_id;
function get_defs_or_refs(repo, commit, path, line, character, defs_or_refs) {
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
}`;
}
exports.get_defs_or_refs = get_defs_or_refs;
exports.LIST_ALL_REPOS = `query {
  search(query: "type:repo") {
    results {
      repositories {
        name
      }
   }
 }
}`;
function git_blame(repo, query) {
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
}`;
}
exports.git_blame = git_blame;
function list_matching_branches(repo, query) {
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
}`;
}
exports.list_matching_branches = list_matching_branches;
function count_search(query) {
    return `query {
  search(${sanitise_query(query)}) {
    results {
      matchCount
    }
  }
}`;
}
exports.count_search = count_search;
exports.GET_EXTERNAL_SERVICES = `query {
  externalServices {
    nodes {
      id
      displayName
      config
    }
  }
}`;
function update_external_service(id, config) {
    const config_str = JSON.stringify({ config });
    const pre = '{config';
    const config_strip_end = config_str.substring(0, config_str.length - 1);
    const config_strip_start = config_strip_end.substring(pre.length);
    return `mutation Update {
  updateExternalService(id: "${id}", config: "${config_strip_start}") {
    updatedAt
  }
}`;
}
exports.update_external_service = update_external_service;
function schedule_repo_sync(host_domain, repo_name) {
    return `mutation Check {
  scheduleRepositoryPermissionsSync(repository: "${host_domain}/${repo_name}") {
    alwaysNil
  }
}`;
}
exports.schedule_repo_sync = schedule_repo_sync;
function get_repo_permission_sync(host_domain, repo_name) {
    return `query {
  repository(name: "${host_domain}/${repo_name}") {
    permissionsInfo {
			syncedAt
    }
	}
}`;
}
exports.get_repo_permission_sync = get_repo_permission_sync;
exports.FETCH_ALL_EVENTS = `
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
}`;
//# sourceMappingURL=schema.js.map