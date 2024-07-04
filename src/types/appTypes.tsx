import { Timestamp } from "firebase/firestore";

export type PostType = {
  userId: string;
  title: string;
  content: string;
  // removing embedding property for now
  // the vertex AI extension we are using
  // to perform our seach creates an embedding field
  // automatically when a new post is created
  // embedding: number[];
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

export type SearchResultType = {
  userId: string;
  title: string;
  content: string;
  embedding: object;
};
