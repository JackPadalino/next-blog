// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import gemini from "@/gemini/geminiConfig";
import {
  Firestore,
  FieldValue,
  VectorQuery,
  VectorQuerySnapshot,
} from "@google-cloud/firestore";
import firestoreClient from "@/cloud/cloudConfig";
import { db } from "@/firebase/firebaseApp";
import { collection, getDocs } from "firebase/firestore";
// import { PostType } from "@/types/appTypes";

/** Need to add logic to add new post to firestore db */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let response = req.body;
    const geminiResponse = await gemini.embedContent(response.content);
    let postEmbedding = geminiResponse.embedding.values;
    postEmbedding = FieldValue.vector(postEmbedding);
    response.embedding = postEmbedding;
    res.status(200).json(response);
    // const querySnapshot = await getDocs(collection(db, "posts"));
    // querySnapshot.forEach((doc) => {
    //   // doc.data() is never undefined for query doc snapshots
    //   console.log(doc.id, " => ", doc.data());
    // });
    // res.status(200).json("ok");
  } catch (error) {
    console.error("Error making post:", error);
    res.status(500).json({ message: "Internal Server Error", embedding: [] });
  }
};

export default handler;
