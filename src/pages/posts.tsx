import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";

import { auth, db } from "../firebase/firebaseApp";
import { collection, doc, addDoc, getDocs } from "firebase/firestore";

import { postsState } from "@/recoil/postsAtom";
import { useRecoilValue } from "recoil";

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
} from "@chakra-ui/react";

import { PostType } from "../types/appTypes"; // importing type
import styles from "@/styles/Posts.module.css";

const Posts = () => {
  const user = auth.currentUser; // currently signed in user?
  const posts = useRecoilValue(postsState);
  //   const [posts, setPosts] = useState<PostType[]>([]);
  const [formData, setFormData] = useState<PostType>({
    userId: "",
    content: "",
  });

  //   // fetching posts from Firebase
  //   const fetchPosts = async () => {
  //     try {
  //       const postsSnapshot = await getDocs(collection(db, "posts"));
  //       // have to explicitly say that each document coming from Firebase DB is a 'PostType'
  //       // It comes down originally as type 'DocumentData'?
  //       const xPosts = postsSnapshot.docs.map((doc) => doc.data() as PostType);
  //       setPosts(xPosts);
  //     } catch (error: any) {
  //       console.log(error);
  //     }
  //   };

  // Event handler for post form change
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  // create a new post
  const handlePost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add a new post with a generated id
    const data = {
      userId: user?.uid,
      content: formData.content,
    };
    try {
      await addDoc(collection(db, "posts"), data);
      //   fetchPosts();
      setFormData({
        userId: "",
        content: "",
      });
    } catch (error: any) {
      console.log(error);
    }
  };

  //   useEffect(() => {
  //     fetchPosts();
  //   }, []);

  return (
    <Box className={`${styles.postsContainer}`}>
      <Heading>Posts</Heading>
      {user && (
        <form className={`${styles.postForm}`} onSubmit={handlePost}>
          <FormControl id="content" isRequired>
            <Textarea
              // isRequired
              value={formData.content}
              onChange={handleInputChange}
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
      )}
      {posts.length ? (
        <Box>
          {posts.map((post: PostType, index: number) => (
            <Text key={index}>{post.content}</Text>
          ))}
        </Box>
      ) : (
        <Text>Loading posts...</Text>
      )}
    </Box>
  );
};

export default Posts;
