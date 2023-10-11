import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { resolvers } from "./resolvers.js"
import { typeDefs } from "./schema.js"
import { enlistedFilename, officerFilename } from "./constants.js";
import { getEnlistedWorksheet, getOfficerWorksheet } from './helpers.js';

interface MyContext {
  token?: string;
}

// Required logic for integrating with Express
const app = express();
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);

// Same ApolloServer initialization as before, plus the drain plugin
// for our httpServer.
const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
// Ensure we wait for our server to start
await server.start();

// Redirect to api graphql by default
app.get('/', function (_, res) {
  res.redirect('/api/graphql');
});

// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(
  '/api/graphql',
  cors<cors.CorsRequest>(),
  bodyParser.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  }),
);

// health check sysinfo
const __BUILD_ID__ = process.env.BUILD_ID
const __NODE_ENV__ = process.env.NODE_ENV
const __VERSION__ = process.env.VERSION

app.get('/api/sysinfo', async function (_, res) {
  try {
    // determine if we are using local file system or s3
    const isUsingS3 = process.env.S3_BUCKET_NAME && process.env.S3_BUCKET_NAME !== "test_bucket"
    // grab the last modified times
    const { lastModifiedAt: officerLastUpdated } = await getOfficerWorksheet()
    const { lastModifiedAt: enlistedLastUpdated } = await getEnlistedWorksheet()

    res.status(200).json({
      version: __VERSION__,
      buildId: __BUILD_ID__,
      nodeEnv: __NODE_ENV__,
      isUsingS3,
      enlisted: {
        filename: enlistedFilename,
        lastModifiedAt: enlistedLastUpdated,
      },
      officer: {
        filename: officerFilename,
        lastModifiedAt: officerLastUpdated,
      },
    })
  } catch (e) {
    console.error(e)
    // still output json for status in event of a failure
    res.status(500).send({
      version: __VERSION__,
      buildId: __BUILD_ID__,
      nodeEnv: __NODE_ENV__,
      error: 'unable to access spreadsheets'
    })
  }
});

// Modified server startup
await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000/`);
