import { Outlet } from "react-router-dom"
import NavBar from "./components/navbar"
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Footer from "./components/Footer";

//Set up HTTP connection to GraphQL server
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Middleware to add the token in the headers
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token'); // Retrieve the token from local storage
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "", // Attach the token if available
    },
  };
});


const client = new ApolloClient({
  link: authLink.concat(httpLink), // Combine auth middleware with HTTP link
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
    </ApolloProvider>
  )
}

export default App
