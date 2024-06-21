import { useState, useEffect } from "react";

import type { AppProps } from "next/app";

import { ChakraProvider, Text } from "@chakra-ui/react";

import { db } from "../firebase/firebaseApp";
import { collection, doc, addDoc, getDocs } from "firebase/firestore";

import { RecoilRoot } from "recoil";
import { useRecoilState } from "recoil";
import { postsState } from "../recoil/postsAtom";
import { PostType } from "@/types/appTypes";

import "@/styles/globals.css";
import Layout from "../components/layout";

export default function App({ Component, pageProps }: AppProps) {
  // creating a "component" to fetch data from Firestore db
  // had to create a component for fetching data because "useRecoilState"
  // function must be wrapped inside RecoilRoot component
  const FetchData = () => {
    const [recoilPostsState, setRecoilPostsState] = useRecoilState(postsState);

    // fetching posts from Firebase
    const fetchPosts = async () => {
      console.log("fetching posts");
      try {
        const postsSnapshot = await getDocs(collection(db, "posts"));
        // have to explicitly say that each document coming from Firebase DB is a 'PostType'
        // It comes down originally as type 'DocumentData'?
        const xPosts = postsSnapshot.docs.map((doc) => doc.data() as PostType);
        // update the posts array in the posts atom
        // update only the posts array within PostsState
        setRecoilPostsState((prevState) => ({
          ...prevState,
          posts: xPosts,
        }));
      } catch (error: any) {
        console.log(error);
      }
    };

    useEffect(() => {
      // only run if array is empty
      if (!recoilPostsState.posts.length) {
        fetchPosts();
      }
    }, []);

    return null;
  };

  return (
    <RecoilRoot>
      <ChakraProvider>
        <Layout>
          <Component {...pageProps} />
          <FetchData />
        </Layout>
      </ChakraProvider>
    </RecoilRoot>
  );
}
