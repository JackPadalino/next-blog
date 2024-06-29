import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  MouseEvent,
} from "react";

import Link from "next/link";

import { auth, db, functions } from "../firebase/firebaseApp";

import {
  Box,
  Text,
  Textarea,
  Heading,
  Button,
  Input,
  FormControl,
  IconButton,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
} from "@chakra-ui/react";

import { SearchIcon } from "@chakra-ui/icons";

import { httpsCallable } from "firebase/functions";
import { signInAnonymously } from "firebase/auth";

import styles from "@/styles/Navbar.module.css";

const Navbar = () => {
  const user = auth.currentUser; // currently signed in user?
  const [searchFormQuery, setSearchFormQuery] = useState<string>("");

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchFormQuery(e.target.value);
  };

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // sign in anonymously (enabled to allow users to search)
      signInAnonymously(auth)
        .then(() => {
          const queryCallable = httpsCallable(
            functions,
            `ext-${process.env.NEXT_PUBLIC_FIRESTORE_SEARCH_EXTENSION_NAME}-queryCallable`
          );
          // perform the search and limit the results to 10
          queryCallable({ query: searchFormQuery, limit: 10 })
            .then((result) => {
              // display the results - an array of ids that best match our query
              // closest matches first
              console.log(result.data);
            })
            .catch((error) => {
              console.error("Error querying function:", error);
            });
        })
        .catch((error) => {
          console.error("Error signing in anonymously:", error);
        });
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
