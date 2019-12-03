import { useState, useEffect } from "react";
import { db } from "../firebase";

const useFollowers = customers => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let subscribed = true;

    let userList = [];

    if (customers.length > 0) {
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
    } else {
      setLoading(false);
      setFollowers([]);
    }

    return () => (subscribed = false);
  }, [customers]);

  return {
    loading,
    followers,
    error
  };
};

export default useFollowers;
