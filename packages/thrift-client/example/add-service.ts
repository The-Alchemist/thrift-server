import { config } from '@creditkarma/dynamic-config'
import { Int64 } from '@creditkarma/thrift-server-core'

import {
    createThriftServer,
    ZipkinTracingHapi,
} from '@creditkarma/thrift-server-hapi'

import * as Hapi from 'hapi'

import {
    AddService,
} from './generated/add-service'

(async function startService(): Promise<void> {
    const SERVER_CONFIG = await config().get('add-service')

    /**
     * Implementation of our thrift service.
     *
     * Notice the second parameter, "context" - this is the Hapi request object,
     * passed along to our service by the Hapi thrift plugin. Thus, you have access to
     * all HTTP request data from within your service implementation.
     */
    const impl = new AddService.Processor<Hapi.Request>({
        ping(): void {
            return
        },
        add(a: number, b: number, context?: Hapi.Request): number {
            return a + b
        },
        addInt64(a: Int64, b: Int64, context?: Hapi.Request): Int64 {
            return new Int64(a.toNumber() + b.toNumber())
        },
    })

    /**
     * Creates Hapi server with thrift endpoint.
     */
    const server: Hapi.Server = createThriftServer({
        port: SERVER_CONFIG.port,
        path: SERVER_CONFIG.path,
        thriftOptions: {
            serviceName: 'add-service',
            handler: impl,
        },
    })

    server.register(
        ZipkinTracingHapi({
            localServiceName: 'add-service',
            endpoint: 'http://localhost:9411/api/v1/spans',
            sampleRate: 1.0,
            httpInterval: 1000,
            httpTimeout: 5000,
        }),
        (err: any) => {
            if (err) {
                console.log('error: ', err)
                throw err
            } else {
                server.start((err: any) => {
                    if (err) {
                        throw err
                    }

                    if (server.info !== null) {
                        console.log(`Add service running at: ${server.info.uri}`)
                    }
                })
            }
        },
    )
}())
