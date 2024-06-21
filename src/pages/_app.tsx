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
