import React, { useEffect, useState } from "react";
import { coursesData } from "../data.js";
import { getResponseGet } from "../../../lib/utils.js";

export default function useGetEnrolledCourses() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const learnerId = localStorage.getItem("id");
  const getEnrollCourseData = async () => {
    setLoading(true);
    // setTimeout(setData(coursesData), 1000);
    const response = await getResponseGet(`enrolledCourses/${learnerId}`);
    if (response?.data) {
      console.log("Enrolled courses", response.data);
      setData(response.data);
    } else {
      console.error("Failed to fetch enrolled courses", response);
    }
    setLoading(false);
  };

  return { data, loading, getEnrollCourseData };
}
