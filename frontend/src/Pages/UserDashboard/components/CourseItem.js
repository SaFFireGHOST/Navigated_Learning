import { Button } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import courseBook from "../coursThumbnail.jpg";
import EnrollCouse from "./EnrollCouse";

const CourseItem = ({ data, enroll, setRefresh,setCourseId }) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleCourseView = () => {
    if (enroll) {
      console.log("abt courseId",data);
      setCourseId(data.course_id);
      navigate("/course");
    }
  };

  const handleEnroll = () => setShow(true);
  return (
    <div className="course-card" onClick={handleCourseView}>
      <div className="course-tumbnail">
        <img
          src={courseBook}
          width="100%"
          height={180}
          alt={""}
          style={{ borderTopLeftRadius: "7px", borderTopRightRadius: "7px" }}
        />
      </div>
      <div className="course-details">
        <div className="course-title">{data.course_name}</div>
        <div className="course-desc">{data.course_description}</div>
        <div className="course-prof">{data.title}</div>
        {!enroll && (
          <>
            <div className="course-action">
              <Button variant="contained" size="small" onClick={handleEnroll}>
                Enroll
              </Button>
            </div>
            <EnrollCouse
              course={data}
              show={show}
              setShow={setShow}
              setRefresh={setRefresh}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CourseItem;
