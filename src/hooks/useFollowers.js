import { useState, useEffect } from "react";
import { db } from "../firebase";

const useFollowers = customers => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let subscribed = true;

    let userList = [];

    customers.map(async user => {
      try {
        const doc = await db
          .collection("users")
          .doc(user)
          .get();
        if (subscribed) {
          userList = [...userList, doc.data()];
          setFollowers(userList);
          setLoading(false);
        }
      } catch (err) {
        setError(err);
      }
    });

    return () => (subscribed = false);
  }, [customers]);

  return {
    loading,
    followers,
    error
  };
};

export default useFollowers;
