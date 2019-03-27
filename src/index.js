import '@babel/polyfill'
import { GraphQLServer, PubSub } from 'graphql-yoga'
import db from './db'
import prisma from './prisma'
import { resolvers, fragmentReplacements } from './resolvers/index'

const port = 4000 || process.env.PORT
const pubsub = new PubSub()
const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    context(request) {
        return {
            db,
            pubsub,
            prisma,
            request
        }
    },
    resolvers,
    fragmentReplacements
})

server.start({ port }, () => {
    console.log(`Server is running on port ${port}`)
})