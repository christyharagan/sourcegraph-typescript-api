"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.make_request = void 0;
const cross_fetch_1 = __importDefault(require("cross-fetch"));
function is_error(m) {
    return m.errors !== undefined;
}
async function make_request({ sg_host, sg_token }, query) {
    const r = await cross_fetch_1.default(`${sg_host}/.api/graphql`, {
        method: 'post',
        headers: {
            Authorization: `token ${sg_token}`
        },
        body: JSON.stringify({
            query
        })
    });
    const t = await r.text();
    try {
        const j = JSON.parse(t);
        if (is_error(j)) {
            throw new Error('Unexpected response from Sourcegraph API: ' + t);
        }
        else {
            if (!j.data) {
                throw new Error('Unexpected response from Sourcegraph API: ' + t);
            }
            return j;
        }
    }
    catch (_) {
        throw new Error('Unexpected response from Sourcegraph API: ' + t);
    }
}
exports.make_request = make_request;
