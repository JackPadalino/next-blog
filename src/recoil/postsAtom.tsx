import { atom } from "recoil";
import { PostType } from "@/types/appTypes";

type PostsState = {
  posts: PostType[];
  // some other attributes here
};

const defaultPostsState: PostsState = {
  posts: [],
};

// getting error here in _app.tsx online 33!
// have to change 'any' type here back to PostsState!
export const postsState = atom<any>({
  key: "PostsState",
  default: defaultPostsState,
});
