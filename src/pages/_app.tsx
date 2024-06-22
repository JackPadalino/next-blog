import type { AppProps } from "next/app";
import { ChakraProvider, Text } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";
import FetchData from "@/components/fetchData";
import Layout from "../components/layout";
import "@/styles/globals.css";

/**
 * Root of application
 * FetchData is a component that is fetching data from Firebase DB
 */
export default function App({ Component, pageProps }: AppProps) {
  // Tried to put logic for fetching Firestore data here inside this
  // app component, but this does not work. The logic must be wrapped
  // inside the <RecoilRoot> component.
  return (
    <RecoilRoot>
      <FetchData />
      <ChakraProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </RecoilRoot>
  );
}
