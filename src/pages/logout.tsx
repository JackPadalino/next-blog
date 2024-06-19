import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseApp";

const Logout = () => {
  const router = useRouter();
  useEffect(() => {
    signOut(auth)
      .then(() => {
        router.push("/login");
      })
      .catch((error) => {
        // An error happened.
      });
  }, []);
  return null;
};

export default Logout;
