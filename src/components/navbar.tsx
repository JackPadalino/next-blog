import React, { useState, ChangeEvent, FormEvent } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { auth } from "../firebase/firebaseApp";

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
      const response = await fetch("/api/search", {
        method: "POST",
        body: searchFormQuery,
      });
      if (response.ok) {
        const data = await response.json();
        const xSearchResults = data.results.map(
          (result: any) => result.data as SearchResultType
        );
        setRecoilSearchResultsState({
          searchQuery: searchFormQuery,
          searchResults: xSearchResults,
        });
        router.push("/results");
      } else {
        console.error("Oops! Something happened with the search...");
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
