import Http from '@/helpers/http'
import { toValue } from 'vue'
import type { AxiosResponse } from 'axios'

export async function get(url: string, config = {}): Promise<AxiosResponse> {
  return Http.get(toValue(url), config)
}

export async function post(url: string, data: any = {}, config = {}): Promise<AxiosResponse> {
  return Http.post(toValue(url), data, config)
}

export async function put(url: string, data: any = {}, config = {}): Promise<AxiosResponse> {
  return Http.put(toValue(url), data, config)
}

export async function del(url: string, config = {}): Promise<AxiosResponse> {
  return Http.delete(toValue(url), config)
}
