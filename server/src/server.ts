import express from "express";
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { authenticateToken } from './utils/auth.js';

// Import the two parts of a GraphQL schema
import { typeDefs, resolvers } from './schemas/index.js';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});


const startApolloServer = async () => {
  await server.start();
  await db();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static('../client/dist'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/graphql', expressMiddleware(server, {
  context: async ({ req }) => {
    const authContext = authenticateToken({ req });
    return authContext;
  }
}));



app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}!`);
  console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
});
};

startApolloServer();