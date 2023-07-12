import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { StandardResponse } from './common'
import qs from 'qs'

export const baseUrl = 'http://202.194.15.150:6999/api/'

export async function request(path: string, method: string, useAuth: boolean, data?: any) {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  } as any
  if (useAuth) {
    if (!localStorage.getItem('token')) throw new Error('login required')
    headers['Authorization'] = 'Bearer ' + localStorage.getItem('token')
  }
  return await wrapAxios({
    url: baseUrl + path,
    method,
    headers,
    data: data ? qs.stringify(data) : undefined,
  })
}

export async function wrapAxios(config: AxiosRequestConfig<any>) {
  try {
    const res = await axios<StandardResponse>(config)
    const { data: respData, code, msg } = res.data
    if (code > 299) {
      throw new Error(msg)
    }
    return respData
  } catch (e) {
    if ((e as AxiosError).response?.data) {
      const { msg } = (e as AxiosError).response?.data as StandardResponse
      throw new Error(msg)
    }
    throw e
  }
}
