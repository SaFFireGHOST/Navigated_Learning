import React, { useState } from "react";
import Popup from "./Popup";
import { Button, Spinner } from "react-bootstrap";
import { getResponsePost } from "../../../lib/utils";

const EnrollCouse = ({ course, show, setShow, setRefresh }) => {
  const [loading, setLoading] = useState(false);
  const learnerId = localStorage.getItem("id");

  const enrollCourse = async () => {
    setLoading(true);
    const response = await getResponsePost("/enrolls", {
      course_id: course.course_id,
      learner_id: learnerId,
      x_coordinate: 0.1,
      y_coordinate: 0.1,
      polyline: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    });
    setLoading(false);

    if (response) {
        console.log(response)
      setRefresh(true);
    }
    setShow(false);
  };
  return (
    <Popup show={show} setShow={setShow}>
      <>
        {show && (
          <div className="learnerSummaryBody">
            {loading ? (
              <>
                <div className="center">
                  <Spinner animation="border" style={{ color: "blueviolet" }} />
                  <p
                    style={{
                      marginTop: "13px",
                      color: "#fff",
                      fontSize: "20px",
                    }}
                  >
                    Please wait while enrolling to the course
                  </p>
                </div>
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <p
                  style={{ marginTop: "13px", color: "#fff", fontSize: "20px" }}
                >
                  Please Confirm for enrolling the course "{course.course_name}"
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                  }}
                >
                  <Button
                    className="summarySubmitButton"
                    onClick={enrollCourse}
                    disabled={loading}
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </>
    </Popup>
  );
};

export default EnrollCouse;
