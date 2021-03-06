import React, { useState } from "react";
import { Page, Card, TextStyle, TextContainer } from "@shopify/polaris";
import OpenHousePicker from "../components/OpenHousePicker";
import Moment from "react-moment";
import { useSelector, useDispatch } from "react-redux";
import { db } from "../firebase";

const OpenHouse = () => {
  const user = useSelector(state => state.user);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState({
    start: new Date()
  });

  const dispatch = useDispatch();

  const handleSubmit = async () => {
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
      setFormOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const displayTimes = time => {
    const startTime = Number(time.split(":")[0]);
    const endTime = Number(time.split(":")[0]) + 2;

    return `${startTime <= 12 ? startTime : startTime - 12}${
      startTime <= 11 ? `AM` : `PM`
    } to ${endTime <= 12 ? endTime : endTime - 12}${
      endTime <= 11 ? `AM` : `PM`
    }`;
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
        <TextContainer>
          <p>
            <TextStyle variation="subdued">
              Once per month all sellers must host an “Open house” and allow
              buyers and prospective buyers to see your merchandise before they
              buy. The open house allows for sellers and buyers to establish a
              connection and fuels trust between the parties. Buyers get a
              chance to see not only what they are buying but also the
              environment they are buying from. Open house also provides sellers
              with an opportunity to highlight products and market their goods
              in a new way.
            </TextStyle>
          </p>
        </TextContainer>
        <br />
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
            <span> from {displayTimes(user.open_house.time)}</span>
          </>
        )}
      </Card>
    </Page>
  );
};

export default OpenHouse;
