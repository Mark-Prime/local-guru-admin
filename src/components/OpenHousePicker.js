import React, { useState, useEffect } from "react";
import { DatePicker } from "@shopify/polaris";

const OpenHousePicker = ({ setSelectedDate, selectedDate }) => {
  const [{ month, year }, setDate] = useState({
    month: 0,
    year: 0
  });

  useEffect(() => {
    const d = new Date();
    setDate({
      month: d.getMonth(),
      year: d.getYear()
    });
  }, [setDate]);

  return (
    <DatePicker
      month={month}
      year={year}
      onChange={setSelectedDate}
      selected={selectedDate}
    />
  );
};

export default OpenHousePicker;
