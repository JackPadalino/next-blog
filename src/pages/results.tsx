import React, { useEffect } from "react";

import { useRecoilState } from "recoil";
import { searchResultsState } from "../recoil/searchAtom";
import { SearchResultType } from "@/types/appTypes";

import {
  Box,
  Text,
  Heading,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@chakra-ui/react";

const Results = () => {
  const [recoilSearchResultsState, setRecoilSearchResultsState] =
    useRecoilState(searchResultsState);

  // pulling search results from Recoil - sent up from navbar upon user search
  console.log(recoilSearchResultsState);

  return (
    <Box>
      <Heading>Search results</Heading>
    </Box>
  );
};

export default Results;
