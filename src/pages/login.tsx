import React, { useState, ChangeEvent, FormEvent } from "react";
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

  // Event handler for form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <Box className={`${styles.loginContainer}`}>
      <Heading>Login page</Heading>
      <form className={`${styles.loginForm}`} onSubmit={handleSubmit}>
        <FormControl id="email" isRequired>
          <Input
            type="text"
            placeholder="Username"
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
    </Box>
  );
};

export default Login;
