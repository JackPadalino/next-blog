import { atom } from "recoil";
import { PostType } from "@/types/appTypes";

type PostsState = {
  posts: PostType[];
  // some other attributes here
};

const defaultPostsState: PostsState = {
  posts: [],
  // initialize other attributes here
};

export const postsState = atom<PostsState>({
  key: "PostsState",
  default: defaultPostsState,
});
