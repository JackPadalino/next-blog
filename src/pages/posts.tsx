import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  SyntheticEvent,
} from "react";

import { auth, db, functions } from "../firebase/firebaseApp";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  query,
} from "firebase/firestore";

// import gemini from "@/gemini/geminiConfig";

import { postsState } from "@/recoil/postsAtom";
import { useRecoilState } from "recoil";

import {
  Box,
  Text,
  Textarea,
  Heading,
  Button,
  Input,
  FormControl,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@chakra-ui/react";

import { PostType } from "../types/appTypes"; // importing type
import styles from "@/styles/Posts.module.css";

import { httpsCallable } from "firebase/functions";
import { signInAnonymously } from "firebase/auth";

const Posts = () => {
  const user = auth.currentUser; // currently signed in user?
  const [recoilPostsState, setRecoilPostsState] = useRecoilState(postsState);
  //   const [posts, setPosts] = useState<PostType[]>([]);
  const [postFormError, setPostFormError] = useState<string>("");
  const [postFormData, setPostFormData] = useState<PostType>({
    userId: "",
    title: "",
    content: "",
    // embedding: [],
  });
  const [searchFormQuery, setSearchFormQuery] = useState<string>("");

  // fetching posts from Firebase
  const fetchPosts = async () => {
    try {
      const postsSnapshot = await getDocs(collection(db, "posts"));
      // have to explicitly say that each document coming from Firebase DB is a 'PostType'
      // It comes down originally as type 'DocumentData'?
      const xPosts = postsSnapshot.docs.map((doc) => doc.data() as PostType);
      // update the posts array in the posts atom
      // update only the posts array within PostsState
      setRecoilPostsState((prevState) => ({
        ...prevState,
        posts: xPosts,
      }));
    } catch (error: any) {
      console.log(error);
    }
  };

  // Event handler for post form change
  const handlePostInputChange = (
    e: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>
  ) => {
    if (!user) {
      setPostFormError("Please log in in to make a post!");
      return;
    }
    const { id, value } = e.target;
    setPostFormData({
      ...postFormData,
      [id]: value,
    });
  };

  // create a new post
  const handlePost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      return;
    }
    try {
      // generate vector embedding data (to be used for semantic search)
      // getting an error about embedding the userId (number) here
      // for now we will only pass the title and content from the form to Gemini
      // const vectorString = `title:${postFormData.title},content:${postFormData.content}`;
      // const response = await gemini.embedContent(vectorString);
      // const embedding = response.embedding.values;

      // Add a new post with a generated id
      // and embedding data from gemini
      const data = {
        userId: user?.uid,
        title: postFormData.title,
        content: postFormData.content,
        // embedding: embedding,
      };

      await addDoc(collection(db, "posts"), data);
      fetchPosts();
      setPostFormData({
        userId: "",
        title: "",
        content: "",
        // embedding: [],
      });
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchFormQuery(e.target.value);
  };

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // const response = await gemini.embedContent(searchFormQuery);
      // const embedding = response.embedding.values;
      // console.log(embedding);

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
    <Box className={`${styles.postsMainContainer}`}>
      <Heading>Posts</Heading>
      <Box className={`${styles.postsFormsContainer}`}>
        <form className={`${styles.postForm}`} onSubmit={handlePost}>
          <FormControl id="title" isRequired>
            <Input
              type="text"
              placeholder="Title"
              borderColor="grey"
              focusBorderColor="dark-grey"
              value={postFormData.title}
              onChange={handlePostInputChange}
            />
          </FormControl>
          <FormControl id="content" isRequired>
            <Textarea
              value={postFormData.content}
              onChange={handlePostInputChange}
              placeholder="Say something nice..."
              borderColor="grey"
              focusBorderColor="dark-grey"
              //   size="sm"
            />
          </FormControl>

          <Button type="submit" colorScheme="teal">
            Post
          </Button>
        </form>
        <form className={`${styles.postForm}`} onSubmit={handleSearch}>
          <FormControl id="search" isRequired>
            <Input
              type="text"
              placeholder="Search for posts"
              borderColor="grey"
              focusBorderColor="dark-grey"
              value={searchFormQuery}
              onChange={handleSearchInputChange}
            />
          </FormControl>
          <Button type="submit" colorScheme="teal">
            Search
          </Button>
        </form>
      </Box>
      {postFormError && <Text>{postFormError}</Text>}
      {recoilPostsState.posts.length ? (
        <Box className={`${styles.postsContainer}`}>
          {recoilPostsState.posts.map((post: PostType, index: number) => (
            <Card key={index} className={`${styles.postCard}`}>
              <CardBody>
                <Heading>{post.title}</Heading>
                <Text>{post.content}</Text>
              </CardBody>
            </Card>
          ))}
        </Box>
      ) : (
        <Text>There are no posts right now!</Text>
      )}
    </Box>
  );
};

export default Posts;
