import { atom } from "recoil";
import { SearchResultType } from "@/types/appTypes";

type SearchRestultsState = {
  searchQuery: string;
  searchResults: SearchResultType[];
  // some other attributes here
};

const defaultSearchResultsState: SearchRestultsState = {
  searchQuery: "",
  searchResults: [],
  // initialize other attributes here
};

export const searchResultsState = atom<SearchRestultsState>({
  key: "SearchRestultsState",
  default: defaultSearchResultsState,
});
