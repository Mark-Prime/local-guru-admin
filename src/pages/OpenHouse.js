import React, { useState } from "react";
import { Page, Card } from "@shopify/polaris";
import OpenHousePicker from "../components/OpenHousePicker";
import Moment from "react-moment";
import { useSelector, useDispatch } from "react-redux";
import { db } from "../firebase";

const OpenHouse = () => {
  const user = useSelector(state => state.user);

  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState({
    start: new Date()
  });

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await db
        .collection("producers")
        .doc(user.uid)
        .update({
          open_house: selectedDate
        });

      const updatedUser = await db
        .collection("producers")
        .doc(user.uid)
        .get();
      dispatch({ type: "login_user", payload: updatedUser.data() });
      setLoading(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Page title="Open House">
      <Card
        title="Set Open house"
        sectioned
        primaryFooterAction={
          !user.open_house && {
            content: "Set date",
            onAction: () => handleSubmit()
          }
        }
      >
        {user.open_house ? (
          <span>
            <Moment format="dddd, MMMM Do YYYY, h a" date={user.open_house} />
          </span>
        ) : (
          <OpenHousePicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        )}
      </Card>
    </Page>
  );
};

export default OpenHouse;
