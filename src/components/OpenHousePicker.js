import React, { useState, useEffect } from "react";
import { DatePicker, Select } from "@shopify/polaris";

const OpenHousePicker = ({
  setSelectedDate,
  selectedDate,
  selectedTime,
  setSelectedTime
}) => {
  const [{ month, year }, setDate] = useState({
    month: 0,
    year: 0
  });

  useEffect(() => {
    const d = new Date();
    setDate({
      month: d.getMonth(),
      year: d.getFullYear()
    });
  }, [setDate]);

  const options = [
    { label: "7:00 AM - 9:00 AM", value: "7:00" },
    { label: "8:00 AM - 10:00 AM", value: "8:00" },
    { label: "9:00 AM - 11:00 AM", value: "9:00" },
    { label: "10:00 AM - 12:00 PM", value: "10:00" },
    { label: "11:00 AM - 11:00 AM", value: "11:00" },
    { label: "12:00 PM - 2:00 PM", value: "12:00" },
    { label: "1:00 PM - 3:00 PM", value: "13:00" },
    { label: "2:00 PM - 4:00 PM", value: "14:00" },
    { label: "3:00 PM - 5:00 PM", value: "15:00" },
    { label: "4:00 PM - 6:00 PM", value: "16:00" },
    { label: "5:00 PM - 7:00 PM", value: "17:00" },
    { label: "6:00 PM - 8:00 PM", value: "18:00" },
    { label: "7:00 PM - 9:00 PM", value: "19:00" },
    { label: "8:00 PM - 10:00 PM", value: "20:00" }
  ];

  return (
    <>
      <DatePicker
        month={month}
        year={year}
        onChange={setSelectedDate}
        selected={selectedDate}
        disableDatesBefore={new Date()}
      />
      <br />
      <Select
        label="Choose time"
        options={options}
        value={selectedTime}
        onChange={value => setSelectedTime(value)}
      />
    </>
  );
};

export default OpenHousePicker;
