"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FETCH_ALL_EVENTS = exports.get_repo_permission_sync = exports.schedule_repo_sync = exports.update_external_service = exports.GET_EXTERNAL_SERVICES = exports.count_search = exports.list_matching_branches = exports.git_blame = exports.LIST_ALL_REPOS = void 0;
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
  search(query: "${query} repo:${repo}@*refs/heads/* type:diff select:commit.diff.added ") {
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
  search(query: "${query} repo:${repo}@*refs/heads/*") {
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
  search(query: "${query}") {
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
    const pre = '{"config"';
    const config_strip_end = config_str.substring(0, config_str.length - 1);
    const config_strip_start = config_strip_end.substring(pre.length);
    return `mutation Update {
  updateExternalService(id: "${id}", config: ${config_strip_start}) {
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
