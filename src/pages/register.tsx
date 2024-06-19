import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
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

interface RegisterType {
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const user = auth.currentUser; // currently signed in user?
  const router = useRouter();

  //Form state and functions
  const [show, setShow] = useState<boolean>(false);
  const [registerError, setRegisterError] = useState<string>("");

  const handleClick = () => setShow(!show);
  const [formData, setFormData] = useState<RegisterType>({
    email: "",
    password: "",
    confirmPassword: "",
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
  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password === formData.confirmPassword) {
      try {
        // const response = await signInWithEmailAndPassword(
        //   auth,
        //   formData.email,
        //   formData.password
        // );
        // const user = response.user;
        await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        router.push("/");
      } catch (error: any) {
        // The 'any' type here captures any kind of error thrown
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === "auth/email-already-in-use") {
          setRegisterError("An account with this email already exists.");
        }
      }
    } else {
      setRegisterError("Please make sure passwords match.");
    }
  };

  return (
    <Box className={`${styles.loginContainer}`}>
      <Heading>Register</Heading>
      {user ? (
        <Text>You are already signed in.</Text>
      ) : (
        <form className={`${styles.loginForm}`} onSubmit={handleRegister}>
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
          <FormControl id="confirmPassword" isRequired>
            <Input
              type={show ? "text" : "password"}
              placeholder="Confirm password"
              pr="4.5rem"
              borderColor="grey"
              focusBorderColor="dark-grey"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
          </FormControl>
          <Button type="submit" colorScheme="teal">
            Register
          </Button>
          {registerError !== "" && <Text>{registerError}</Text>}
        </form>
      )}
    </Box>
  );
};

export default Register;
