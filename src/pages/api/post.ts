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

type Data = {
  post: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    // embedding post content with gemini
    const response = await gemini.embedContent(req.body);
    let postEmbedding = response.embedding.values;
    postEmbedding = FieldValue.vector(postEmbedding);
    console.log(postEmbedding);
    res.status(200);
  } catch (error) {
    console.error("Error making post:", error);
  }
};

export default handler;
