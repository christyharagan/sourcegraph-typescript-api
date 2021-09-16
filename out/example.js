"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const creds = {
    sg_host: 'https://MY-SG-DOMAIN',
    sg_token: 'MY-ACCESS-TOKEN'
};
// Add repositories to a code-host
_1.get_code_host_id(creds, 'MY-CODE-HOST-NAME').then(code_host_id => {
    return _1.add_github_repositories(creds, code_host_id, ['REPO_A', 'REPO_B']);
}).then(() => {
    console.log('Repos added successfully!');
}).catch(e => {
    console.error(e);
});
// Find all branches and commits where 'TODO' was added across every repo
_1.list_all_repos(creds).then(repos => {
    repos.forEach(r => {
        _1.git_blame(creds, r, `TODO`).then(rr => {
            console.log('Results for repository: ' + r);
            console.log('==========');
            console.log('Matching branches:');
            console.log('----------');
            rr.repos_and_branches[r].forEach(branch => {
                console.log('  ' + branch);
            });
            console.log('Matching commits:');
            console.log('----------');
            rr.commits.forEach(c => {
                console.log('  commit: ' + c.id + '  on date: ' + c.date + '  by person: <' + c.person.name + '>' + c.person.email);
            });
        });
    });
});
