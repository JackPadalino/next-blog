import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebaseApp";
import { doc, setDoc } from "firebase/firestore";
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
  Stack,
} from "@chakra-ui/react";
import styles from "@/styles/Login.module.css";

interface RegisterType {
  firstName: string;
  lastName: string;
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
    firstName: "",
    lastName: "",
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
    // Validate passwords
    if (formData.password !== formData.confirmPassword) {
      setRegisterError("Please make sure passwords match.");
      return;
    }
    try {
      // add user to Firebase Auth
      const response = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      // add user to Firebase Firestore
      const data = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      };
      await setDoc(doc(db, "users", response.user.uid), data);
      router.push("/");
    } catch (error: any) {
      // The 'any' type here captures any kind of error thrown
      if (error.cdoe === "auth/email-already-in-use") {
        setRegisterError("An account with this email already exists.");
      } else {
        setRegisterError(
          "An unexpected error occured. Please refresh and try again."
        );
      }
    }
  };

  return (
    <Box className={`${styles.loginContainer}`}>
      <Heading>Register</Heading>
      {user ? (
        <Text>You are already signed in.</Text>
      ) : (
        <form className={`${styles.loginForm}`} onSubmit={handleRegister}>
          <Stack direction="row">
            <FormControl id="firstName" isRequired>
              <Input
                type="text"
                placeholder="First name"
                borderColor="grey"
                focusBorderColor="dark-grey"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl id="lastName" isRequired>
              <Input
                type="text"
                placeholder="Last name"
                borderColor="grey"
                focusBorderColor="dark-grey"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </FormControl>
          </Stack>
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
