import fastify, { FastifyInstance, FastifyRequest, FastifyReply, RouteHandlerMethod } from '../../fastify'
import { expectType, expectError } from 'tsd'
import { HTTPMethods } from '../../types/utils'
import * as http from 'http'

/*
 * Testing Fastify HTTP Routes and Route Shorthands.
 * Verifies Request and Reply types as well.
 * For the route shorthand tests the argument orders are:
 * - `(path, handler)`
 * - `(path, options, handler)`
 * - `(path, options)`
 */

const routeHandler: RouteHandlerMethod = (request, reply) => {
  expectType<FastifyRequest>(request)
  expectType<FastifyReply>(reply)
}

type LowerCaseHTTPMethods = 'get' | 'post' | 'put' | 'patch' | 'head' | 'delete' | 'options'

;['GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'DELETE', 'OPTIONS'].forEach(method => {
  // route method
  expectType<FastifyInstance>(fastify().route({
    method: method as HTTPMethods,
    url: '/',
    handler: routeHandler
  }))

  const lowerCaseMethod: LowerCaseHTTPMethods = method.toLowerCase() as LowerCaseHTTPMethods

  // method as method
  expectType<FastifyInstance>(fastify()[lowerCaseMethod]('/', routeHandler))
  expectType<FastifyInstance>(fastify()[lowerCaseMethod]('/', {}, routeHandler))
  expectType<FastifyInstance>(fastify()[lowerCaseMethod]('/', { handler: routeHandler }))

  interface BodyInterface { prop: string }
  interface QuerystringInterface { prop: number }
  interface ParamsInterface { prop: boolean }
  interface HeadersInterface { prop: string }

  interface ContextConfigType {
    foo: string;
    bar: number;
  }

  interface RouteGeneric {
    Body: BodyInterface;
    Querystring: QuerystringInterface;
    Params: ParamsInterface;
    Headers: HeadersInterface;
  }

  fastify()[lowerCaseMethod]<RouteGeneric, ContextConfigType>('/', { config: { foo: 'bar', bar: 100 } }, (req, res) => {
    expectType<BodyInterface>(req.body)
    expectType<QuerystringInterface>(req.query)
    expectType<ParamsInterface>(req.params)
    expectType<http.IncomingHttpHeaders & HeadersInterface>(req.headers)
    expectType<string>(res.context.config.foo)
    expectType<number>(res.context.config.bar)
  })

  fastify().route<RouteGeneric, ContextConfigType>({
    url: '/',
    method: method as HTTPMethods,
    config: { foo: 'bar', bar: 100 },
    onRequest: (req, res, done) => { // these handlers are tested in `hooks.test-d.ts`
      expectType<BodyInterface>(req.body)
      expectType<QuerystringInterface>(req.query)
      expectType<ParamsInterface>(req.params)
      expectType<http.IncomingHttpHeaders & HeadersInterface>(req.headers)
      expectType<string>(res.context.config.foo)
      expectType<number>(res.context.config.bar)
    },
    preParsing: (req, res, done) => {
      expectType<BodyInterface>(req.body)
      expectType<QuerystringInterface>(req.query)
      expectType<ParamsInterface>(req.params)
      expectType<http.IncomingHttpHeaders & HeadersInterface>(req.headers)
      expectType<string>(res.context.config.foo)
      expectType<number>(res.context.config.bar)
    },
    preValidation: (req, res, done) => {
      expectType<BodyInterface>(req.body)
      expectType<QuerystringInterface>(req.query)
      expectType<ParamsInterface>(req.params)
      expectType<http.IncomingHttpHeaders & HeadersInterface>(req.headers)
      expectType<string>(res.context.config.foo)
      expectType<number>(res.context.config.bar)
    },
    preHandler: (req, res, done) => {
      expectType<BodyInterface>(req.body)
      expectType<QuerystringInterface>(req.query)
      expectType<ParamsInterface>(req.params)
      expectType<http.IncomingHttpHeaders & HeadersInterface>(req.headers)
      expectType<string>(res.context.config.foo)
      expectType<number>(res.context.config.bar)
    },
    onResponse: (req, res, done) => {
      expectType<BodyInterface>(req.body)
      expectType<QuerystringInterface>(req.query)
      expectType<ParamsInterface>(req.params)
      expectType<http.IncomingHttpHeaders & HeadersInterface>(req.headers)
      expectType<string>(res.context.config.foo)
      expectType<number>(res.context.config.bar)
    },
    onError: (req, res, done) => {
      expectType<BodyInterface>(req.body)
      expectType<QuerystringInterface>(req.query)
      expectType<ParamsInterface>(req.params)
      expectType<http.IncomingHttpHeaders & HeadersInterface>(req.headers)
      expectType<string>(res.context.config.foo)
      expectType<number>(res.context.config.bar)
    },
    preSerialization: (req, res, done) => {
      expectType<BodyInterface>(req.body)
      expectType<QuerystringInterface>(req.query)
      expectType<ParamsInterface>(req.params)
      expectType<http.IncomingHttpHeaders & HeadersInterface>(req.headers)
      expectType<string>(res.context.config.foo)
      expectType<number>(res.context.config.bar)
    },
    onSend: (req, res, done) => {
      expectType<BodyInterface>(req.body)
      expectType<QuerystringInterface>(req.query)
      expectType<ParamsInterface>(req.params)
      expectType<http.IncomingHttpHeaders & HeadersInterface>(req.headers)
      expectType<string>(res.context.config.foo)
      expectType<number>(res.context.config.bar)
    },
    handler: (req, res) => {
      expectType<BodyInterface>(req.body)
      expectType<QuerystringInterface>(req.query)
      expectType<ParamsInterface>(req.params)
      expectType<http.IncomingHttpHeaders & HeadersInterface>(req.headers)
      expectType<string>(res.context.config.foo)
      expectType<number>(res.context.config.bar)
    }
  })
})

expectError(fastify().route({
  url: '/',
  method: 'CONNECT', // not a valid method
  handler: routeHandler
}))

expectType<FastifyInstance>(fastify().route({
  url: '/',
  method: ['GET', 'POST'],
  handler: routeHandler
}))

expectError(fastify().route({
  url: '/',
  method: ['GET', 'POST', 'OPTION'], // OPTION is a typo for OPTIONS
  handler: routeHandler
}))
