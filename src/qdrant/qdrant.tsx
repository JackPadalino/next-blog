import { QdrantClient } from "@qdrant/js-client-rest";

const qdrant = new QdrantClient({
  url: process.env.NEXT_PUBLIC_QDRANT_DB_URL,
  apiKey: process.env.NEXT_PUBLIC_QDRANT_API_KEY,
});

export default qdrant;
