export declare type RunSearchErrorResponse = {
    errors: {
        message: string;
        locations: {
            line: number;
            column: number;
        }[];
    }[];
};
export declare function delete_code_monitor(monitor_id: string): string;
export declare function get_users(): string;
export declare type GetUsers = {
    data: {
        users: {
            nodes: {
                id: string;
                username: string;
                displayName: string;
                siteAdmin: boolean;
                emails: {
                    email: string;
                }[];
            }[];
        };
    };
};
export declare function get_user_code_monitors(by: 'username' | 'email', value: string): string;
export declare type GetUserCodeMonitors = {
    data: {
        user: {
            monitors: {
                nodes: {
                    description: string;
                    trigger: {
                        query: string;
                    };
                    actions: {
                        nodes: {
                            header: string;
                            recipients: {
                                nodes: {
                                    id: string;
                                    namespaceName: string;
                                }[];
                            };
                        }[];
                    };
                }[];
            };
        };
    };
};
export declare function create_code_monitor(user_or_org_id: string, description: string, enabled: boolean, query: string, email_header?: string): string;
export declare type CreateCodeMonitor = {
    data: {
        createCodeMonitor: {
            id: string;
        };
    };
};
export declare function get_user_id(by: 'username' | 'email', value: string): string;
export declare type GetUserId = {
    data: {
        user: {
            id: string;
        };
    };
};
export declare function get_defs_or_refs(repo: string, commit: string, path: string, line: string, character: string, defs_or_refs: 'definitions' | 'references'): string;
export declare type GetDefsOrRefs<DefsOrRefs extends 'definitions' | 'references'> = {
    data: {
        repository: {
            commit: {
                blob: {
                    lsif: {
                        [prop in DefsOrRefs]: {
                            nodes: {
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
                            }[];
                        };
                    };
                };
            };
        };
    };
};
export declare const LIST_ALL_REPOS = "query {\n  search(query: \"type:repo\") {\n    results {\n      repositories {\n        name\n      }\n   }\n }\n}";
export declare type ListAllRepos = {
    data: {
        search: {
            results: {
                repositories: {
                    name: string;
                }[];
            };
        };
    };
};
export declare function git_blame(repo: string, query: string): string;
export declare type GitBlame = {
    data: {
        search: {
            results: {
                results: {
                    commit: {
                        abbreviatedOID: string;
                        author: {
                            date: string;
                            person: {
                                name: string;
                                email: string;
                            };
                        };
                    };
                }[];
                repositories: {
                    branches: {
                        nodes: {
                            name: string;
                        }[];
                    };
                    name: string;
                }[];
            };
        };
    };
};
export declare function list_matching_branches(repo: string, query: string): string;
export declare type ListMatchingBranches = {
    data: {
        search: {
            results: {
                repositories: {
                    branches: {
                        nodes: {
                            name: string;
                        }[];
                    };
                    name: string;
                }[];
            };
        };
    };
};
export declare function count_search(query: string): string;
export declare const GET_EXTERNAL_SERVICES = "query {\n  externalServices {\n    nodes {\n      id\n      displayName\n      config\n    }\n  }\n}";
export declare function update_external_service(id: string, config: string): string;
export declare function schedule_repo_sync(host_domain: string, repo_name: string): string;
export declare function get_repo_permission_sync(host_domain: string, repo_name: string): string;
export declare type RepositoryPermissionSync = {
    data: {
        repository: {
            permissionsInfo: string | null;
        };
    };
};
export declare type GetExternalServices = {
    data: {
        externalServices: {
            nodes: {
                id: string;
                displayName: string;
                config: string;
            }[];
        };
    };
};
export declare const FETCH_ALL_EVENTS = "\nquery {\n  users(activePeriod: ALL_TIME) {\n    nodes {\n      emails  {\n        email\n      }\n      username\n      eventLogs {\n        nodes{\n          name\n         url\n        }\n      }\n    }\n  }\n}";
export declare type FetchAllEvents = {
    data: {
        users: {
            nodes: {
                eventLogs: {
                    nodes: {
                        name: string;
                        url: string;
                    }[];
                };
                emails: {
                    email: string;
                }[];
                username: string;
            }[];
        };
    };
};
