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

/** this seems to be returning relevant results
 * however it is going to be very slow since we
 * are iterating through every post in the db and
 * making a comparison
 */
const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    const results: any = [];

    // embedding query with gemini
    const geminiResponse = await gemini.embedContent(req.body);
    const queryEmbedding = geminiResponse.embedding.values;

    // calculating query embeddings magnitude
    const sumOfSquares = queryEmbedding.reduce(
      (sum: number, value: number) => sum + value * value,
      0
    );
    const queryEmbeddingMag = Math.sqrt(sumOfSquares);

    // retrieving all posts from db
    const postsRef = firestoreClient.collection("posts");
    const postsSnapshot = await postsRef.get();

    // iterating through each post and calculating cosine similarity
    postsSnapshot.forEach((doc: any) => {
      const data = doc.data();
      const postEmbedding = data.embedding;
      const postEmbeddingMag = data.embeddingMag;

      // calculate dot product between query and post embeddings
      const dotProduct = queryEmbedding.reduce(
        (sum: number, a: number, i: string | number) =>
          sum + a * postEmbedding[i],
        0
      );

      // compute cosine similarity between query and post
      const cosineSimilarity =
        dotProduct / (queryEmbeddingMag * postEmbeddingMag);

      // populating results array
      results.push({
        id: doc.id,
        data: doc.data(),
        similarity: cosineSimilarity,
      });

      // order results by similarity
      results.sort((a: any, b: any) => b.similarity - a.similarity);
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
