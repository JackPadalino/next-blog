import { atom } from "recoil";
import { SearchResultType } from "@/types/appTypes";

type SearchRestultsState = {
  searchResults: SearchResultType[];
  // some other attributes here
};

const defaultSearchResultsState: SearchRestultsState = {
  searchResults: [],
  // initialize other attributes here
};

export const searchResultsState = atom<SearchRestultsState>({
  key: "SearchRestultsState",
  default: defaultSearchResultsState,
});
