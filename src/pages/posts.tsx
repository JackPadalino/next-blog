import React, { useState, ChangeEvent, FormEvent } from "react";

import { auth, db } from "../firebase/firebaseApp";
import { collection, addDoc, getDocs } from "firebase/firestore";

// import gemini from "@/gemini/geminiConfig";

import { postsState } from "@/recoil/postsAtom";
import { useRecoilState } from "recoil";

import { PostType } from "../types/appTypes"; // importing type

import {
  Box,
  Text,
  Textarea,
  Heading,
  Button,
  Input,
  FormControl,
  Card,
  CardBody,
} from "@chakra-ui/react";
import styles from "@/styles/Posts.module.css";

const Posts = () => {
  const user = auth.currentUser; // currently signed in user?
  const [recoilPostsState, setRecoilPostsState] = useRecoilState(postsState);
  //   const [posts, setPosts] = useState<PostType[]>([]);
  const [postFormError, setPostFormError] = useState<string>("");
  const [postFormData, setPostFormData] = useState<PostType>({
    userId: "",
    title: "",
    content: "",
    embedding: [],
  });

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
      // const data = {
      //   userId: user?.uid,
      //   title: postFormData.title,
      //   content: postFormData.content,
      //   // embedding: embedding,
      // };

      // await addDoc(collection(db, "posts"), data);
      // fetchPosts();
      // setPostFormData({
      //   userId: "",
      //   title: "",
      //   content: "",
      //   // embedding: [],
      // });

      const data = {
        userId: user.uid,
        title: postFormData.title,
        content: postFormData.content,
        embedding: postFormData.embedding,
      };

      const response = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setPostFormData({
          userId: "",
          title: "",
          content: "",
          embedding: [],
        });
      } else {
        console.error("Oops! Something happened with the search...");
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <Box className={`${styles.postsMainContainer}`}>
      <Heading>Posts</Heading>
      <Box className={styles.postsSecondContainer}>
        {recoilPostsState.posts.length ? (
          <Box className={`${styles.postsCardsContainer}`}>
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
          {postFormError && <Text>{postFormError}</Text>}
        </Box>
      </Box>
    </Box>
  );
};

export default Posts;
