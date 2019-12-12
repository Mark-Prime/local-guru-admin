import React, { useState } from "react";
import { Page, Card } from "@shopify/polaris";
import OpenHousePicker from "../components/OpenHousePicker";
import Moment from "react-moment";
import { useSelector, useDispatch } from "react-redux";
import { db } from "../firebase";

const OpenHouse = () => {
  const user = useSelector(state => state.user);

  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
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
          open_house: { ...selectedDate, time: selectedTime }
        });

      const updatedUser = await db
        .collection("producers")
        .doc(user.uid)
        .get();
      dispatch({ type: "login_user", payload: updatedUser.data() });
      setLoading(true);
      setFormOpen(false);
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
          formOpen || !user.open_house
            ? {
                content: "Set date",
                onAction: () => handleSubmit()
              }
            : {
                content: "Change date",
                onAction: () => setFormOpen(true)
              }
        }
      >
        {formOpen || !user.open_house ? (
          <span>
            <OpenHousePicker
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
            />
          </span>
        ) : (
          <>
            <Moment
              format="dddd, MMMM Do YYYY"
              date={user.open_house.start.seconds * 1000}
            />
            <span> @ {user.open_house.time}</span>
          </>
        )}
      </Card>
    </Page>
  );
};

export default OpenHouse;
