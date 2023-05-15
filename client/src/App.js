import './App.css';
import Home from "./components/Home";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

function App() {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "http://localhost:8000/graphql",
  });

  return (
    <ApolloProvider client={client} >
      <div className="App">
        <Home />
      </div>
    </ApolloProvider>
  );
}

export default App;
