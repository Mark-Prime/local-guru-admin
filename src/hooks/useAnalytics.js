import { useEffect, useState } from "react";
import { db } from "../firebase";

const useAnalytics = (user, range) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [views, setViews] = useState({ current: 0, past: 0 });
  const [sales, setSales] = useState({ current: 0, past: 0 });
  const [orders, setOrders] = useState([{ current: 0, past: 0 }]);
  const [followers, setFollowers] = useState({ current: 0, past: 0 });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let limit = 14;
      setSales({ current: 0, past: 0 });
      setViews({ current: 0, past: 0 });
      setFollowers({ current: 0, past: 0 });
      setOrders({ current: 0, past: 0 });
      setProducts([]);

      try {
        switch (range) {
          // Monthly range
          case 1:
            // TODO: Change this in case of 31 day months
            limit = 61;
            break;
          case 2:
            limit = 365;
            break;
          default:
            limit = 14;
        }

        const data = await db
          .collection("producers")
          .doc(user)
          .collection("analytics")
          .orderBy("date", "desc")
          .limit(limit)
          .get();

        data.docs.forEach(async (doc, index) => {
          const { sales, orders, views, followers } = doc.data();
          const currentDays = limit / 2 - 1;
          const docProducts = doc.data().products;

          if (index < currentDays) {
            setSales(prevState => {
              return { ...prevState, current: prevState.current + sales };
            });
            setFollowers(prevState => {
              return { ...prevState, current: prevState.current + followers };
            });
            setOrders(prevState => {
              return { ...prevState, current: prevState.current + orders };
            });
            setViews(prevState => {
              return { ...prevState, current: prevState.current + views };
            });

            if (docProducts) {
              let newArray = [];

              Object.keys(docProducts).map(async item => {
                const product = await db
                  .collection("products")
                  .doc(item)
                  .get();
                const { title, image } = product.data();

                newArray = [
                  ...newArray,
                  {
                    title: title,
                    image: image,
                    sales: docProducts[item]
                  }
                ];

                newArray.sort((a, b) => {
                  return b.sales - a.sales;
                });

                return setProducts(newArray);
              });
            }
          } else {
            setSales(prevState => {
              return { ...prevState, past: prevState.past + sales };
            });
            setFollowers(prevState => {
              return { ...prevState, past: prevState.past + followers };
            });
            setOrders(prevState => {
              return { ...prevState, past: prevState.past + orders };
            });
            setViews(prevState => {
              return { ...prevState, past: prevState.past + views };
            });
          }
        });
        setLoaded(true);
      } catch (err) {
        console.log(err);
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
    products,
    followers
  };
};

export default useAnalytics;
