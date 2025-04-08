import React from "react";
import { ChakraProvider, Container } from "@chakra-ui/react";
import TopTokens from "./components/TopTokens";

function App() {
  return (
    <ChakraProvider>
      <Container maxW="container.xl" py={8}>
        <TopTokens />
      </Container>
    </ChakraProvider>
  );
}

export default App;
