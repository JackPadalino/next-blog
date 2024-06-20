import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "../firebase/firebaseApp";
import {
  Box,
  Text,
  Heading,
  Button,
  Input,
  FormControl,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
} from "@chakra-ui/react";
import styles from "@/styles/Login.module.css";

const Posts = () => {
  return (
    <Box className={`${styles.postsContainer}`}>
      <Heading>Posts</Heading>
    </Box>
  );
};

export default Posts;
