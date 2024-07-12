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

/**
 * Endpoing for processing user's query and making
 * cosine similarity to return relevant search results.
 *
 * This is returning relevant results
 * however it will be slow in the future. We
 * are iterating through every post in the db and
 * making a comparison O(n).
 *
 * In the future, consider fetching only each doc's ID,
 * embedding, and embeddingMag (instead of all data),
 * then process the posts in batches.
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

      // populating results array with cosine similartiy greater than
      // or equal to 0.70
      if (cosineSimilarity >= 0.7) {
        results.push({
          id: doc.id,
          data: doc.data(),
          similarity: cosineSimilarity,
        });
      }

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
