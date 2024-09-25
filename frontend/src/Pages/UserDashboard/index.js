import React, { useEffect, useState } from "react";
import useGetCourses from "./hooks/useGetCourses";
import UserInfo from "./components/UserInfo";
import CoursesList from "./components/CoursesList";
import "./css/userDashboard.css";
import useGetEnrolledCourses from "./hooks/useGetEnrolledCourses";

const UserDashboard = ({setCourseId}) => {
  const {
    data,
    loading: enrollLoading,
    getEnrollCourseData,
  } = useGetEnrolledCourses();
  const { allCourses, loading: allLoading, getAllCourseData } = useGetCourses();
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    if (refresh) {
      getAllCourseData();
      getEnrollCourseData();
      setRefresh(false);
    }
  }, [refresh]);
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "white",
        boxSizing: "border-box",
      }}
    >
      <UserInfo />
      <CoursesList
        title={"Your Courses"}
        data={data}
        enroll={true}
        loading={enrollLoading}
        setRefresh={setRefresh}
        setCourseId={setCourseId}
      />
      <CoursesList
        title={"Recommended Courses"}
        data={allCourses}
        enroll={false}
        loading={allLoading}
        setRefresh={setRefresh}
      />
    </div>
  );
};

export default UserDashboard;
