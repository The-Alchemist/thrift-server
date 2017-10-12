import {
  ProtocolType,
  TransportType,
} from '@creditkarma/thrift-server-core'

export interface IHttpConnectionOptions {
  hostName: string
  port: number
  path?: string
  transport?: TransportType
  protocol?: ProtocolType
}

export interface IHttpConnection {
  transport: TransportType
  protocol: ProtocolType
  write(dataToWrite: Buffer): Promise<Buffer>
}