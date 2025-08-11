import Btn from "@util/reuseBtn.jsx";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DetailBoard = () => {
  const { category, boardId } = useParams();
  console.log("DetailBoard category", category);
  console.log("DetailBoard boardId", boardId);
  return <></>;
};

export default DetailBoard;
