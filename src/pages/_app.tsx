import type { AppProps } from "next/app";
import { ChakraProvider, Text } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";
import FetchData from "@/components/fetchData";
import Layout from "../components/layout";
import "@/styles/globals.css";

// imports for fetching data
// import { useEffect } from "react";
// import { db } from "../firebase/firebaseApp";
// import { collection, getDocs } from "firebase/firestore";
// import { useRecoilState } from "recoil";
// import { postsState } from "../recoil/postsAtom";
// import { PostType } from "@/types/appTypes";

/**
 * Root of application
 * FetchData is a component that is fetching data from Firebase DB
 */
export default function App({ Component, pageProps }: AppProps) {
  // Tried to put logic for fetching Firestore data here inside this
  // app component, but this does not work. The logic must be wrapped
  // inside the <RecoilRoot> component.
  // const [recoilPostsState, setRecoilPostsState] = useRecoilState(postsState);
  // const fetchPosts = async () => {
  //   console.log("fetching posts");
  //   try {
  //     const postsSnapshot = await getDocs(collection(db, "posts"));
  //     const xPosts = postsSnapshot.docs.map((doc) => doc.data() as PostType);
  //     setRecoilPostsState((prevState) => ({
  //       ...prevState,
  //       posts: xPosts,
  //     }));
  //   } catch (error: any) {
  //     console.log(error);
  //   }
  // };

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
