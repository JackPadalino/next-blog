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
  results: any;
  error: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    const results: any = [];

    // embedding query with gemini
    const response = await gemini.embedContent(req.body);
    const queryEmbedding = response.embedding.values;

    const postsRef = firestoreClient.collection("posts");
    // const postsSnapshot = await postsRef.get();
    // postsSnapshot.forEach((doc: any) => {
    //   results.push({
    //     id: doc.id,
    //     data: doc.data(),
    //   });
    // });

    const vectorQuery = postsRef.findNearest(
      "embedding",
      FieldValue.vector(queryEmbedding),
      {
        limit: 10,
        distanceMeasure: "COSINE",
      }
    );

    const vectorQuerySnapshot = await vectorQuery.get();
    vectorQuerySnapshot.forEach((doc: any) => {
      results.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    res.status(200).json({
      results,
      error: "",
    });
  } catch (error) {
    console.error("Error processing API request:", error);
    res.status(500).json({ results: [], error: "Internal Server Error" });
  }
};

export default handler;
