// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import gemini from "@/gemini/geminiConfig";
// import { FieldValue } from "@google-cloud/firestore";
import firestoreClient from "@/cloud/cloudConfig";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let newPost = req.body;
    // generate text embedding for new post with Gemini embeddings model
    const geminiResponse = await gemini.embedContent(newPost.content);
    let postEmbedding = geminiResponse.embedding.values;
    /**
    have to comment this out - to perform the cosine similarity
    calculation in the search api endpoint the embedding must
    be a plain array - not a FieldValue type
    */
    // postEmbedding = FieldValue.vector(postEmbedding);

    // calculating embeddings array magnitude
    // sum of the squares of each component
    const sumOfSquares = postEmbedding.reduce(
      (sum: number, value: number) => sum + value * value,
      0
    );
    // square root of the sum of squares
    const embeddingMag = Math.sqrt(sumOfSquares);
    newPost.embedding = postEmbedding;
    newPost.embeddingMag = embeddingMag;

    // add a new document with a generated id.
    const postsRef = firestoreClient.collection("posts");
    const newPostRef = await postsRef.add(newPost);
    res.status(200).json({ message: "Post successful", postId: newPostRef.id });
  } catch (error) {
    console.error("Error making post:", error);
    res.status(500).json({ message: "Internal Server Error", embedding: [] });
  }
};

export default handler;
