// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import gemini from "@/gemini/geminiConfig";
import { FieldValue } from "@google-cloud/firestore";
import firestoreClient from "@/cloud/cloudConfig";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let newPost = req.body;
    // generate text embedding for new post with Gemini embeddings model
    const geminiResponse = await gemini.embedContent(newPost.content);
    let postEmbedding = geminiResponse.embedding.values;
    postEmbedding = FieldValue.vector(postEmbedding);
    newPost.embedding = postEmbedding;

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
