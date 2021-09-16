"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetch_all_events = exports.find_users_who_accessed_repos = exports.update_code_host_config = exports.get_code_host_configs = exports.get_code_host_config = exports.get_external_services = exports.get_github_configs = exports.get_github_config = exports.get_code_host_id = exports.has_repo_permissions_synced = exports.sync_repo = exports.remove_github_repositories = exports.add_github_repositories = exports.find_matching_branches = exports.list_all_repos = exports.git_blame = void 0;
const request_1 = require("./request");
const schema_1 = require("./schema");
async function git_blame(creds, repo, query) {
    const r = await request_1.make_request(creds, schema_1.git_blame(repo, query));
    const ret = {
        repos_and_branches: {},
        commits: []
    };
    r.data.search.results.repositories.forEach(r => {
        ret.repos_and_branches[r.name] = r.branches.nodes.map(n => n.name);
    });
    r.data.search.results.results.forEach(r => {
        ret.commits.push({
            id: r.commit.abbreviatedOID,
            date: r.commit.author.date,
            person: r.commit.author.person
        });
    });
    return ret;
}
exports.git_blame = git_blame;
async function list_all_repos(creds) {
    const repos = await request_1.make_request(creds, schema_1.LIST_ALL_REPOS);
    return repos.data.search.results.repositories.map(r => r.name);
}
exports.list_all_repos = list_all_repos;
async function find_matching_branches(creds, repo, query) {
    const r = await request_1.make_request(creds, schema_1.list_matching_branches(repo, query));
    const repos = {};
    r.data.search.results.repositories.forEach(r => {
        repos[r.name] = r.branches.nodes.map(n => n.name);
    });
    return repos;
}
exports.find_matching_branches = find_matching_branches;
async function add_github_repositories(creds, code_host_id, repos) {
    const config = await get_github_config(creds, code_host_id);
    if (!config.repos) {
        config.repos = [];
    }
    const rs = config.repos;
    repos.forEach(repo => {
        if (rs.find(r => repo == r)) {
            throw new Error(`Repository already exists in code host with id ${code_host_id}`);
        }
        rs.push(repo);
    });
    await update_code_host_config(creds, code_host_id, config);
}
exports.add_github_repositories = add_github_repositories;
async function remove_github_repositories(creds, code_host_id, repos) {
    const config = await get_github_config(creds, code_host_id);
    if (!config.repos) {
        throw new Error(`Repository does not exist in code host with id ${code_host_id}`);
    }
    const rs = config.repos;
    repos.forEach(repo => {
        const i = rs.indexOf(repo);
        if (i == -1) {
            throw new Error(`Repository does not exist in code host with id ${code_host_id}`);
        }
        rs.splice(i, 1);
    });
    await update_code_host_config(creds, code_host_id, config);
}
exports.remove_github_repositories = remove_github_repositories;
async function sync_repo(creds, host_domain, repo_name) {
    return await request_1.make_request(creds, schema_1.schedule_repo_sync(host_domain, repo_name));
}
exports.sync_repo = sync_repo;
async function has_repo_permissions_synced(creds, host_domain, repo_name) {
    const r = await request_1.make_request(creds, schema_1.get_repo_permission_sync(host_domain, repo_name));
    return r.data.repository.permissionsInfo != null;
}
exports.has_repo_permissions_synced = has_repo_permissions_synced;
async function get_code_host_id(creds, host_name) {
    const scs = await get_external_services(creds);
    const es = scs.find(node => node.displayName == host_name);
    if (!es) {
        throw new Error('Cannot find code host with display name: ' + host_name);
    }
    return es.id;
}
exports.get_code_host_id = get_code_host_id;
async function get_github_config(creds, code_host_id) {
    return get_code_host_config(creds, code_host_id);
}
exports.get_github_config = get_github_config;
async function get_github_configs(creds, code_host_ids) {
    return get_code_host_configs(creds, code_host_ids);
}
exports.get_github_configs = get_github_configs;
async function get_external_services(creds) {
    const scs = await request_1.make_request(creds, schema_1.GET_EXTERNAL_SERVICES);
    return scs.data.externalServices.nodes;
}
exports.get_external_services = get_external_services;
async function get_code_host_config(creds, code_host_id) {
    const scs = await get_external_services(creds);
    const s = scs.find(node => node.id == code_host_id);
    if (!s) {
        throw new Error('Code host not found: ' + code_host_id);
    }
    return JSON.parse(s.config);
}
exports.get_code_host_config = get_code_host_config;
async function get_code_host_configs(creds, code_host_ids) {
    const scs = await get_external_services(creds);
    const configs = {};
    const unfound = {};
    code_host_ids.forEach(n => {
        unfound[n] = true;
    });
    scs.forEach(node => {
        if (unfound[node.id]) {
            delete unfound[node.id];
            configs[node.id] = JSON.parse(node.config);
        }
    });
    if (Object.keys(unfound).length > 0) {
        throw new Error('Code hosts not found: ' + JSON.stringify(Object.keys(unfound)));
    }
    return configs;
}
exports.get_code_host_configs = get_code_host_configs;
async function update_code_host_config(creds, code_host_id, config) {
    return await request_1.make_request(creds, schema_1.update_external_service(code_host_id, JSON.stringify(config)));
}
exports.update_code_host_config = update_code_host_config;
async function find_users_who_accessed_repos(creds, repos) {
    const events = await fetch_all_events(creds);
    const users = events.data.users.nodes.filter(u => u.eventLogs.nodes.find(e => repos.find(repo => e.url.toLowerCase().indexOf(repo.toLowerCase()) != -1)));
    return users ? users.map(u => u.emails.map(e => e.email)) : [];
}
exports.find_users_who_accessed_repos = find_users_who_accessed_repos;
async function fetch_all_events(creds) {
    return await request_1.make_request(creds, schema_1.FETCH_ALL_EVENTS);
}
exports.fetch_all_events = fetch_all_events;
