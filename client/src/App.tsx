import { Outlet } from "react-router-dom"
import NavBar from "./components/navbar"
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: '/graphql',
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
    </>
    </ApolloProvider>
  )
}

export default App
