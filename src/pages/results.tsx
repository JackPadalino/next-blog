import React, { useEffect } from "react";

import { useRecoilState } from "recoil";
import { searchResultsState } from "../recoil/searchAtom";
import { SearchResultType } from "@/types/appTypes";

import { Box, Text, Heading, Card, CardBody } from "@chakra-ui/react";

import styles from "@/styles/Results.module.css";

const Results = () => {
  const [recoilSearchResultsState, setRecoilSearchResultsState] =
    useRecoilState(searchResultsState);

  return (
    <Box className={styles.resultsMainContainer}>
      <Heading>Search results</Heading>
      {recoilSearchResultsState.searchResults.length ? (
        <Box className={`${styles.resultsCardsContainer}`}>
          {recoilSearchResultsState.searchResults.map(
            (searchResult: SearchResultType, index: number) => (
              <Card key={index} className={`${styles.resultCard}`}>
                <CardBody>
                  <Heading>{searchResult.title}</Heading>
                  <Text>{searchResult.content}</Text>
                </CardBody>
              </Card>
            )
          )}
        </Box>
      ) : (
        <Text>Sorry, we didn't find anything related to your search.</Text>
      )}
    </Box>
  );
};

export default Results;
