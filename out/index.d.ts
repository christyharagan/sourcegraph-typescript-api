import { GitHubConnection } from './github_schema';
import { SGCreds } from './request';
import { FetchAllEvents } from './schema';
export declare type Credentials = SGCreds;
export declare function get_definitions(creds: SGCreds, repo: string, commit: string, path: string, line: string, character: string): Promise<{
    url: string;
    resource: {
        path: string;
        repository: {
            name: string;
        };
        commit: {
            oid: string;
            abbreviatedOID: string;
        };
    };
    range: {
        start: {
            line: number;
            character: number;
        };
        end: {
            line: number;
            character: number;
        };
    };
}[]>;
export declare function get_references(creds: SGCreds, repo: string, commit: string, path: string, line: string, character: string): Promise<{
    url: string;
    resource: {
        path: string;
        repository: {
            name: string;
        };
        commit: {
            oid: string;
            abbreviatedOID: string;
        };
    };
    range: {
        start: {
            line: number;
            character: number;
        };
        end: {
            line: number;
            character: number;
        };
    };
}[]>;
export declare function get_user_id(creds: SGCreds, by: 'username' | 'email', value: string): Promise<string>;
export declare function get_user_code_monitors(creds: SGCreds, by: 'username' | 'email', value: string): Promise<{
    description: string;
    trigger: {
        query: string;
    };
    actions: {
        header: string;
        recipients: {
            id: string;
            namespaceName: string;
        }[];
    }[];
}[]>;
export declare function create_code_monitor(creds: SGCreds, user_or_org_id: string, description: string, enabled: boolean, query: string, email_header?: string): Promise<string>;
export declare function delete_code_monitor(creds: SGCreds, monitor_id: string): Promise<void>;
export declare function git_blame(creds: SGCreds, repo: string, query: string): Promise<{
    repos_and_branches: {
        [repo: string]: string[];
    };
    commits: {
        id: string;
        date: string;
        person: {
            name: string;
            email: string;
        };
    }[];
}>;
export declare function list_all_repos(creds: SGCreds): Promise<string[]>;
export declare function find_matching_branches(creds: SGCreds, repo: string, query: string): Promise<{
    [repo: string]: string[];
}>;
export declare function add_github_repositories(creds: SGCreds, code_host_id: string, repos: string[]): Promise<void>;
export declare function remove_github_repositories(creds: SGCreds, code_host_id: string, repos: string[]): Promise<void>;
export declare function sync_repo(creds: SGCreds, host_domain: string, repo_name: string): Promise<unknown>;
export declare function has_repo_permissions_synced(creds: SGCreds, host_domain: string, repo_name: string): Promise<boolean>;
export declare function get_code_host_id(creds: SGCreds, host_name: string): Promise<string>;
export declare function get_github_config(creds: SGCreds, code_host_id: string): Promise<GitHubConnection>;
export declare function get_github_configs(creds: SGCreds, code_host_ids: string[]): Promise<{
    [id: string]: GitHubConnection;
}>;
export declare function get_external_services(creds: SGCreds): Promise<{
    id: string;
    displayName: string;
    config: string;
}[]>;
export declare function get_code_host_config(creds: SGCreds, code_host_id: string): Promise<any>;
export declare function get_code_host_configs(creds: SGCreds, code_host_ids: string[]): Promise<{
    [id: string]: any;
}>;
export declare function update_code_host_config(creds: SGCreds, code_host_id: string, config: any): Promise<unknown>;
export declare function find_users_who_accessed_repos(creds: SGCreds, repos: string[]): Promise<string[][]>;
export declare function fetch_all_events(creds: SGCreds): Promise<FetchAllEvents>;
