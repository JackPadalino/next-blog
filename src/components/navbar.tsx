import React, { useState, ChangeEvent, FormEvent } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { auth, db, functions } from "../firebase/firebaseApp";
import { doc, getDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { signInAnonymously } from "firebase/auth";

import { useRecoilState } from "recoil";
import { searchResultsState } from "../recoil/searchAtom";

import { SearchIcon } from "@chakra-ui/icons";
import { SearchResultType } from "@/types/appTypes";

import {
  Box,
  Button,
  Input,
  FormControl,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import styles from "@/styles/Navbar.module.css";

const Navbar = () => {
  const user = auth.currentUser; // currently signed in user?
  const [searchFormQuery, setSearchFormQuery] = useState<string>("");
  const [recoilSearchResultsState, setRecoilSearchResultsState] =
    useRecoilState(searchResultsState);
  const router = useRouter();

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchFormQuery(e.target.value);
  };

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // // sign in anonymously (enabled to allow users to search)
      // signInAnonymously(auth)
      //   .then(() => {
      //     const queryCallable = httpsCallable(
      //       functions,
      //       `ext-${process.env.NEXT_PUBLIC_FIRESTORE_SEARCH_EXTENSION_NAME}-queryCallable`
      //     );
      //     // perform the search and limit the results to 10
      //     queryCallable({ query: searchFormQuery, limit: 10 })
      //       .then(async (result) => {
      //         // display the results - an array of ids that best match our query
      //         // closest matches first
      //         // console.log(result.data)
      //         const results: any = result.data;
      //         const ids = results[Object.keys(results)[0]];
      //         // creating an array of promises to batch request
      //         // docs from firestore
      //         const docPromises = ids.map((id: string) => {
      //           const docRef = doc(db, "posts", id);
      //           return getDoc(docRef);
      //         });
      //         const docSnapshot = await Promise.all(docPromises);
      //         const xSearchResults = docSnapshot.map(
      //           (doc: any) => doc.data() as SearchResultType
      //         );
      //         setRecoilSearchResultsState({
      //           searchQuery: searchFormQuery,
      //           searchResults: xSearchResults,
      //         });
      //         router.push("/results");
      //       })
      //       .catch((error) => {
      //         console.error("Error querying function:", error);
      //       });
      //   })
      //   .catch((error) => {
      //     console.error("Error signing in anonymously:", error);
      //   });

      // const response = await gemini.embedContent(searchFormQuery);
      // const queryEmbedding = response.embedding.values;

      // const coll = firestoreClient.collection("posts");
      // const vectorQuery: VectorQuery = coll.findNearest(
      //   "embedding",
      //   FieldValue.vector(queryEmbedding),
      //   {
      //     limit: 5,
      //     distanceMeasure: "EUCLIDEAN",
      //   }
      // );

      // const vectorQuerySnapshot: VectorQuerySnapshot = await vectorQuery.get();
      // console.log(vectorQuerySnapshot);
      try {
        const response = await fetch("/api/search", {
          method: "POST",
          body: searchFormQuery,
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } catch (error: any) {
      console.log(error);
    }
    setSearchFormQuery("");
  };

  return (
    <Box className={styles.navbar}>
      <Box className={styles.navbarLeft}>
        <Link className={styles.navbarLink} href="/">
          Home
        </Link>
        <Link className={styles.navbarLink} href="/posts">
          Posts
        </Link>
      </Box>
      <form className={styles.navSearch} onSubmit={handleSearch}>
        <FormControl id="navSearch" isRequired>
          <InputGroup>
            <Input
              type={"text"}
              placeholder="Search"
              pr="4.5rem"
              // borderColor="grey"
              focusBorderColor="dark-grey"
              value={searchFormQuery}
              onChange={handleSearchInputChange}
            />
            <InputRightElement width="4.5rem">
              {/* <Button size="sm" onClick={handleSearch}> */}
              <Button size="sm" type="submit">
                {/* {show ? "Hide" : "Show"} */}
                <SearchIcon />
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
      </form>
      {user ? (
        <Link className={styles.navbarLink} href="/logout">
          Logout
        </Link>
      ) : (
        <Link className={styles.navbarLink} href="/login">
          Login
        </Link>
      )}
    </Box>
  );
};

export default Navbar;
