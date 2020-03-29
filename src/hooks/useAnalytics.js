import { useEffect, useState } from "react";
import { db } from "../firebase";
import moment from "moment";

const useAnalytics = (user, range) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [views, setViews] = useState({ current: 0, past: 0 });
  const [sales, setSales] = useState({ current: 0, past: 0 });
  const [orders, setOrders] = useState([{ current: 0, past: 0 }]);
  const [followers, setFollowers] = useState({ current: 0, past: 0 });

  useEffect(() => {
    const fetchData = async () => {
      setSales({ current: 0, past: 0 });
      setViews({ current: 0, past: 0 });
      setFollowers({ current: 0, past: 0 });
      try {
        let startDate = new moment().startOf("isoweek").valueOf();
        let endDate = Date.now();
        switch (range) {
          // Monthly range
          case 1:
            // TODO: Change this in case of 31 day months
            startDate = moment()
              .startOf("month")
              .valueOf();
            break;
          case 2:
            startDate = moment()
              .startOf("year")
              .valueOf();
            break;
          default:
            endDate = Date.now();
        }

        // Fetch transactions with this producer
        const data = await db
          .collection("transactions")
          .where(`producers.${user}`, "==", true)
          .orderBy("created_at")
          .startAt(startDate)
          .endAt(endDate)
          .get();

        // Map through each document to calculate sales
        data.docs.map(transaction => {
          const { items } = transaction.data();
          return items.map(item => {
            const { price, count } = item;
            return setSales(prevState => ({
              current: prevState.current + price * count,
              past: 0
            }));
          });
        });

        const views = await db
          .collection("producers")
          .doc(user)
          .collection("views")
          .limit(range === "month" ? 30 : range === "year" ? 365 : 7)
          .get();

        views.docs.map(doc => {
          const { count } = doc.data();
          console.log(count);
          return setViews(prevState => ({
            current: prevState.current + count,
            past: 0
          }));
        });

        // Fetch followers
        const followers = await db
          .collection("users")
          .where("following.producer", "==", user)
          .orderBy("following.date")
          .startAt(startDate)
          .endAt(endDate)
          .get();

        setFollowers({ current: followers.docs.length, past: 0 });
        setOrders({ current: data.docs.length, past: 0 });
        setLoaded(true);
      } catch (err) {
        console.log(err);
        setError();
      }
    };

    fetchData();
  }, [loaded, user, range]);

  return {
    loaded,
    error,
    views,
    sales,
    orders,
    followers
  };
};

export default useAnalytics;
