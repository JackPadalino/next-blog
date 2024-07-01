import Head from "next/head";
import { auth } from "../firebase/firebaseApp";
import { Box, Text, Heading } from "@chakra-ui/react";

export default function Home() {
  const user = auth.currentUser; // currently signed in user?

  return (
    <>
      <Head>
        <title>Next Blog</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <Heading>Home</Heading>
        <Text>Welcome to Next Blog!</Text>
      </Box>
    </>
  );
}
