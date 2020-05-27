import React from "react";
import { connectSortBy } from "react-instantsearch-dom";

const SortBy = ({ items, currentRefinement, refine }) => {};

const CustomSortBy = connectSortBy(SortBy);

export default CustomSortBy;
