import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
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

interface LoginType {
  email: string;
  password: string;
}

const Login = () => {
  const user = auth.currentUser; // currently signed in user?
  const router = useRouter();

  //Form state and functions
  const [show, setShow] = useState<boolean>(false);
  const handleClick = () => setShow(!show);
  const [formData, setFormData] = useState<LoginType>({
    email: "",
    password: "",
  });

  // Event handler for input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  // login handler function
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // const response = await signInWithEmailAndPassword(
      //   auth,
      //   formData.email,
      //   formData.password
      // );
      // const user = response.user;
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      router.push("/");
    } catch (error: any) {
      // The 'any' type here captures any kind of error thrown
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(`Error signing in (${errorCode}): ${errorMessage}`);
    }
  };

  return (
    <Box className={`${styles.loginContainer}`}>
      <Heading>Login page</Heading>
      {user ? (
        <Text>You are already signed in.</Text>
      ) : (
        <form className={`${styles.loginForm}`} onSubmit={handleLogin}>
          <FormControl id="email" isRequired>
            <Input
              type="email"
              placeholder="Email"
              borderColor="grey"
              focusBorderColor="dark-grey"
              value={formData.email}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <InputGroup>
              <Input
                type={show ? "text" : "password"}
                placeholder="Password"
                pr="4.5rem"
                borderColor="grey"
                focusBorderColor="dark-grey"
                value={formData.password}
                onChange={handleInputChange}
              />
              <InputRightElement width="4.5rem">
                <Button size="sm" onClick={handleClick}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Button type="submit" colorScheme="teal">
            Login
          </Button>
        </form>
      )}
    </Box>
  );
};

export default Login;
