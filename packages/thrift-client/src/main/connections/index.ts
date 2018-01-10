export * from './HttpConnection'
export * from './AxiosConnection'
export * from './RequestConnection'

import { AxiosInstance } from 'axios'
import * as request from 'request'

import {
  AxiosConnection,
} from './AxiosConnection'

import {
  RequestConnection,
  RequestInstance,
} from './RequestConnection'

import {
  IClientConstructor,
  ICreateClientOptions,
  IHttpConnectionOptions,
} from '../types'

export function fromAxios(
  requestApi: AxiosInstance,
  options: IHttpConnectionOptions): AxiosConnection {
  return new AxiosConnection(requestApi, options)
}

export function fromRequest(
  requestApi: RequestInstance,
  options: IHttpConnectionOptions): RequestConnection {
  return new RequestConnection(requestApi, options)
}

export function createClient<TClient>(
  ServiceClient: IClientConstructor<TClient, request.CoreOptions>,
  options: ICreateClientOptions<request.CoreOptions>,
): TClient {
  const requestClient: RequestInstance = request.defaults(options.requestOptions || {})

  const connection: RequestConnection =
    fromRequest(requestClient, options)

  // Register optional middleware
  connection.register(...(options.register || []))

  return new ServiceClient(connection)
}
