import { Timestamp } from "firebase/firestore";

export type PostType = {
  userId: string;
  content: string;
};

export type RegisterType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginType = {
  email: string;
  password: string;
};
