import { Skeleton } from "@mui/material";
import React from "react";

const LoadingCourse = () => {
  return (
    <div className="course-card">
      <div className="course-tumbnail">
        <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
      </div>
      <div className="course-details">
        <div className="course-title">
          <Skeleton animation="wave" height={10} width="80%" />
        </div>
        <div className="course-desc">
          <Skeleton animation="wave" height={10} width="80%" />
        </div>
        <div className="course-prof">
          <Skeleton animation="wave" height={10} width="80%" />
        </div>
        <div className="course-action"></div>
      </div>
    </div>
  );
};

export default LoadingCourse;
