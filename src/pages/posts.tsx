import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  SyntheticEvent,
} from "react";

import { auth, db } from "../firebase/firebaseApp";
import { collection, doc, addDoc, getDocs } from "firebase/firestore";

import gemini from "@/gemini/geminiConfig";

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

const Posts = () => {
  const user = auth.currentUser; // currently signed in user?
  const [recoilPostsState, setRecoilPostsState] = useRecoilState(postsState);
  //   const [posts, setPosts] = useState<PostType[]>([]);
  const [formData, setFormData] = useState<PostType>({
    userId: "",
    title: "",
    content: "",
    vectorEmbedding: [],
  });

  // fetching posts from Firebase
  const fetchPosts = async () => {
    console.log("fetching posts");
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
  const handleInputChange = (
    e: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  // create a new post
  const handlePost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // generate vector embedding data (to be used for semantic search)
    // getting an error about embedding the userId (number) here
    // for now we will only pass the title and content from the form to Gemini
    const vectorString = `title:${formData.title},content:${formData.content}`;
    try {
      const response = await gemini.embedContent(vectorString);
      const embedding = response.embedding.values;

      // Add a new post with a generated id
      // and embedding data from gemini
      const data = {
        userId: user?.uid,
        title: formData.title,
        content: formData.content,
        vectorEmbedding: embedding,
      };

      await addDoc(collection(db, "posts"), data);
      fetchPosts();
      setFormData({
        userId: "",
        title: "",
        content: "",
        vectorEmbedding: [],
      });
    } catch (error: any) {
      console.log(error);
    }
  };

  //   useEffect(() => {
  //     fetchPosts();
  //   }, []);

  return (
    <Box className={`${styles.postsMainContainer}`}>
      <Heading>Posts</Heading>
      {user && (
        <form className={`${styles.postForm}`} onSubmit={handlePost}>
          <FormControl id="title" isRequired>
            <Input
              type="text"
              placeholder="Title"
              borderColor="grey"
              focusBorderColor="dark-grey"
              value={formData.title}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl id="content" isRequired>
            <Textarea
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
