import fetch from 'cross-fetch'
import { RunSearchErrorResponse } from './schema'

export type SGCreds = {
  sg_host: string
  sg_token: string
}

function is_error(m: any): m is RunSearchErrorResponse {
  return (m as RunSearchErrorResponse).errors !== undefined
}

export async function make_request<T>({ sg_host, sg_token }: SGCreds, query: string): Promise<T> {
  const r = await fetch(`${sg_host}/.api/graphql`, {
    method: 'post',
    headers: {
      Authorization: `token ${sg_token}`
    },
    body: JSON.stringify({
      query
    })
  })
  const t = await r.text()
  try {
    const j = JSON.parse(t)
    if (is_error(j)) {
      throw new Error('Unexpected response from Sourcegraph API: ' + t)
    } else {
      if (j.data) {
        throw new Error('Unexpected response from Sourcegraph API: ' + t)
      }
      return j as T
    }
  } catch (_) {
    throw new Error('Unexpected response from Sourcegraph API: ' + t)
  }
}