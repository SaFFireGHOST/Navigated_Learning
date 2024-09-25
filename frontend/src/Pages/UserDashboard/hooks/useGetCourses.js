import React, { useEffect, useState } from "react";
import { coursesData } from "../data.js";
import { getResponseGet } from "../../../lib/utils.js";

export default function useGetAllCourses() {
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const learnerId = localStorage.getItem("id");
  const getAllCourseData = async () => {
    setLoading(true);
    // setTimeout(setData(coursesData), 1000);
    const response = await getResponseGet(`recomCourses/${learnerId}`);
    if (response?.data) {
      console.log("courses", response.data);
      setAllCourses(response.data);
    } else {
      console.error("Failed to fetch courses", response);
    }
    setLoading(false);
  };

  return { allCourses, loading, getAllCourseData };
}
