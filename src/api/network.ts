import axios from 'axios'
import { StandardResponse } from './common'
import qs from 'qs'

const baseUrl = 'http://localhost:5552/v1/'

export async function request(path: string, method: string, useAuth: boolean, data?: any) {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  } as any
  if (useAuth) {
    if (!localStorage.getItem('token')) throw new Error('login required')
    headers['Authorization'] = 'Bearer ' + localStorage.getItem('token')
  }
  const res = await axios<StandardResponse>(baseUrl + path, {
    method,
    headers,
    data: data ? qs.stringify(data) : undefined,
  })
  const { data: respData, code, msg, _links } = res.data
  if (code > 299) {
    throw new Error(msg)
  }
  let nextLink = _links?.find(l => l.rel === 'next')?.href
  if (nextLink) respData.nextLink = nextLink
  return respData
}
