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
import { PostType } from "@/types/appTypes";

const handler = async (req: NextApiRequest<PostType>, res: NextApiResponse) => {
  try {
    let response = req.body;
    const geminiResponse = await gemini.embedContent(response.content);
    let postEmbedding = geminiResponse.embedding.values;
    postEmbedding = FieldValue.vector(postEmbedding);
    response.embedding = postEmbedding;
    res.status(200).json(response);
  } catch (error) {
    console.error("Error making post:", error);
    res.status(500).json({ message: "Internal Server Error", embedding: [] });
  }
};

export default handler;
