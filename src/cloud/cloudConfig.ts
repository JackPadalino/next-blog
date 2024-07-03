const { Firestore } = require("@google-cloud/firestore");
const path = require("path");

// setting the env variable to store the file path to the
// service account credentials.json file
// do this to set up the firestore client
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(
  process.cwd(),
  "credentials.json"
);

const firestoreClient = new Firestore();

export default firestoreClient;
