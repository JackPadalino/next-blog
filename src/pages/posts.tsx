import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, db } from "../firebase/firebaseApp";
import { collection, doc, addDoc } from "firebase/firestore";
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
import styles from "@/styles/Posts.module.css";

interface PostType {
  userId: string;
  content: string;
}

const Posts = () => {
  const user = auth.currentUser; // currently signed in user?
  const [formData, setFormData] = useState<PostType>({
    userId: "",
    content: "",
  });

  // Event handler for input change
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handlePost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add a new post with a generated id
    const data = {
      userId: user?.uid,
      content: formData.content,
    };
    try {
      await addDoc(collection(db, "posts"), data);
      setFormData({
        userId: "",
        content: "",
      });
    } catch (error: any) {
      console.log(error);
    }
  };

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
    </Box>
  );
};

export default Posts;
