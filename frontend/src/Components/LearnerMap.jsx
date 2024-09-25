import React, { Fragment, useEffect, useRef, useState } from "react";
import { getResponseGet, getResponsePost } from "../lib/utils";
import * as d3 from "d3";
import JourneyMap from "./JourneyMap";
import HexModule from "./Hexmodule";
import ButtonPanel from "./ButtonPanel";
import LearnerPositionComponent from "./LearnerPositionComponent";
// Grid component
const GridComponent = ({ width, height, step }) => {
  const lines = [];
  for (let x = 0; x <= width; x += step) {
    lines.push(
      <line
        key={`v${x}`}
        x1={x}
        y1={0}
        x2={x}
        y2={height}
        stroke="lightgrey"
        strokeWidth="1"
      />
    );
  }
  for (let y = 0; y <= height; y += step) {
    lines.push(
      <line
        key={`h${y}`}
        x1={0}
        y1={y}
        x2={width}
        y2={y}
        stroke="lightgrey"
        strokeWidth="1"
      />
    );
  }
  return <>{lines}</>;
};

// SVG component with zoom
const SVGComponent = ({
  children,
  width,
  height,
  svgRef,
  zoomRef,
  setTransform,
}) => {
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const g = svg.select("g");

    const zoom = d3
      .zoom()
      .scaleExtent([0.6, 10])
      .on("start", (event) => {
        // Check if the zoom event was triggered by dragging
        if (event.sourceEvent && event.sourceEvent.type === "mousedown" && event.sourceEvent.type !== "dblclick") {
          console.log(event.sourceEvent.type)
          svg.style("cursor", "move"); // Set cursor to 'move' on drag start
        }
      })
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setTransform(event.transform);
      })
      .on("end", (event) => {
        svg.style("cursor", "default");
      });
    // console.log("this si the zoom factor", zoom);
    const initialTransform = d3.zoomIdentity.translate(130, 10).scale(0.6);
    svg.call(zoom.transform, initialTransform);  // Apply initial zoom
    g.attr("transform", initialTransform);       // Set initial transform on the group
    setTransform(initialTransform);
    svg.call(zoom);
    zoomRef.current = zoom;
  }, []);

  return (
    <svg ref={svgRef} style={{ width: "100%", height: "100%" }}>
      <g>
        <GridComponent width={1000} height={1000} step={50} />
        {children}
      </g>
    </svg>
  );
};

// Group component
const GroupComponent = ({ children }) => {
  return <>{children}</>;
};

// Circle component
const CircleComponent = ({
  data,
  activitiesState,
  tooltipRef,
  learnerPos,
  coverageRadius,
  transform,
  enrollId,
  xScale,
  yScale,
  enrolledLearner,

}) => {
  // const enrollId=localStorage.getItem(enrollId);
  const handleClick = async (event) => {
    if (isWithinCoverage) {
      const siblingCircle = event.currentTarget.previousSibling; // or nextSibling if text is before circle

      if (siblingCircle && siblingCircle.tagName === 'circle') {
        siblingCircle.setAttribute("fill", "orange");
      }
      activitiesState[1]((activities) => [
        ...activities,
        {
          type: "resource",
          name: data.name,
          link: data.link,
          time: new Date().toString(),
        },
      ]);
      let activityData = {
        type: "resource",
        name: data.name,
        link: data.link,
        time: new Date().toISOString().slice(0, 19).replace('T', ' '),
        enroll_id: enrollId,
      }
      const response = await getResponsePost("/activities", activityData);
      // console.log(response);
      const responseData = response?.data;

    } else {
      event.preventDefault();
    }
  }
  const handleCircleClick = async (event) => {
    if (isWithinCoverage) {
      event.currentTarget.setAttribute("fill", "orange");
      activitiesState[1]((activities) => [
        ...activities,
        {
          type: "resource",
          name: data.name,
          link: data.link,
          time: new Date().toString(),
        },
      ]);
      let activityData = {
        type: "resource",
        name: data.name,
        link: data.link,
        time: new Date().toISOString().slice(0, 19).replace('T', ' '),
        enroll_id: enrollId,
      }
      const response = await getResponsePost("/activities", activityData);
      // console.log(response);
      const responseData = response?.data;
    } else {
      event.preventDefault();
    }
  }

  const handleMouseOver = (event) => {
    const tooltip = d3.select(tooltipRef.current);
    // console.log("ddata is ", data)
    // console.log("x is", data.x)
    tooltip
      .style("visibility", "visible")
      .html(
        `<div>
					<strong>Index:</strong> ${data.index}<br>
					<strong>Name:</strong> ${data.name}<br>
          <strong>Position:</strong> ${Number(data.x).toFixed(3)},${Number(data.y).toFixed(3)}
				</div>`
      )
      .style("left", `${event.pageX + 10}px`)
      .style("top", `${event.pageY + 10}px`);

    // Hide the default text
    d3.select(`#text-${data.id}`).style("visibility", "hidden");
  };

  const handleMouseMove = (event) => {
    const tooltip = d3.select(tooltipRef.current);
    tooltip
      .style("left", `${event.pageX + 10}px`)
      .style("top", `${event.pageY + 10}px`);
  };

  const handleMouseOut = () => {
    const tooltip = d3.select(tooltipRef.current);
    tooltip.style("visibility", "hidden");

    // Restore the default text
    d3.select(`#text-${data.id}`).style("visibility", "visible");
  };

  // const distance = Math.sqrt(
  //   Math.pow(xScale(data.x) - xScale(learnerPos[0]), 2) +
  //   Math.pow(yScale(data.y) - yScale(learnerPos[1]), 2)
  // );

  const isWithinCoverage = enrolledLearner.accessible_resources.includes(data.id);
  const inverseScale = Math.min(1 / transform.k, 1.1);

  return (
    <a
      href={isWithinCoverage ? data.link : "#"}
      target={isWithinCoverage ? "_blank" : ""}
      rel="noopener noreferrer"
    >
      <g>
        <circle
          cx={xScale(data.x)}
          cy={yScale(data.y)}
          r={15 * inverseScale}
          fill={isWithinCoverage ? "#D1E9F6" : "white"}
          stroke="black" // Border color
          strokeWidth={2 * inverseScale} // Border width
          onClick={handleCircleClick}
          onMouseOver={handleMouseOver}
          onMouseMove={handleMouseMove}
          onMouseOut={handleMouseOut}
        />
        <text
          x={xScale(data.x)}
          y={yScale(data.y)}
          fill="black"
          fontSize={`${15 * inverseScale}px`}
          fontFamily="FontAwesome"
          textAnchor="middle" // Center the icon horizontally
          dominantBaseline="middle" // Center the icon vertically
          onClick={handleClick}
          onMouseOver={handleMouseOver}
          onMouseMove={handleMouseMove}
          onMouseOut={handleMouseOut}
        >
          {"\uf16a"}
        </text>
      </g>
    </a>
  );
};

const ModuleCircleComponent = ({
  moduleData,
  activitiesState,
  tooltipRef,
  transform,
  xScale,
  yScale,
}) => {
  // const enrollId=localStorage.getItem(enrollId);

  const handleMouseOver = (event) => {
    const tooltip = d3.select(tooltipRef.current);
    tooltip
      .style("visibility", "visible")
      .html(
        `<div>
					<strong>Index:</strong> ${moduleData.module_id}<br>
					<strong>Name:</strong> ${moduleData.module}<br>
          <strong>Position:</strong> ${(moduleData.x).toFixed(3)},${(moduleData.y).toFixed(3)}
				</div>`
      )
      .style("left", `${event.pageX + 10}px`)
      .style("top", `${event.pageY + 10}px`);

    // Hide the default text
    d3.select(`#text-${moduleData.id}`).style("visibility", "hidden");
  };

  const handleMouseMove = (event) => {
    const tooltip = d3.select(tooltipRef.current);
    tooltip
      .style("left", `${event.pageX + 10}px`)
      .style("top", `${event.pageY + 10}px`);
  };

  const handleMouseOut = () => {
    const tooltip = d3.select(tooltipRef.current);
    tooltip.style("visibility", "hidden");

    // Restore the default text
    d3.select(`#text-${moduleData.id}`).style("visibility", "visible");
  };


  const inverseScale = Math.min(1 / transform.k, 1.1);

  return (
    <g>
      <circle
        cx={xScale(moduleData.x)}
        cy={yScale(moduleData.y)}
        r={20 * inverseScale}
        fill={"red"}
        stroke="black" // Border color
        strokeWidth={2 * inverseScale} // Border width
        onMouseOver={handleMouseOver}
        onMouseMove={handleMouseMove}
        onMouseOut={handleMouseOut}
      />
    </g>
  );
};

// Resource Connection Line
const LineComponent = ({ startPos, endPos }) => {
  return endPos ? (
    <>
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="10"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill={startPos.module_id !== endPos.module_id ? "orange" : "blue"}
          />
        </marker>
      </defs>
      <line
        x1={startPos.x * 8000 - 2800}
        y1={3650 - startPos.y * 8000}
        x2={endPos.x * 8000 - 2800}
        y2={3650 - endPos.y * 8000}
        stroke={startPos.module_id !== endPos.module_id ? "orange" : "blue"}
        strokeWidth="2"
        strokeDasharray={startPos.module_id !== endPos.module_id ? "5,5" : "none"}
        markerEnd="url(#arrowhead)"
      />
    </>
  ) : (
    <Fragment />
  );
};



// Main LearnerMap component
const LearnerMap = ({ activitiesState, learnerPosState, svgRef, zoomRef, enrollId, enrolledLearner, enrolledLearnersByCourse,courseId }) => {
  const [data, setData] = useState([]);
  const [moduleData, setModuleData] = useState([]);
  const [journeyData, setJourneyData] = useState([]);
  const mapRef = useRef(null);
  const [transform, setTransform] = useState(d3.zoomIdentity.translate(130, 10).scale(0.6));
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const tooltipRef = useRef(null);
  const [coverageRadius] = useState(300); // Define the coverage radius (adjust as needed)
  const inverseScale = Math.min(1 / transform.k, 1.1);
  const [showJourney, setShowJourney] = useState(false);
  const [showHex, setShowHex] = useState(false);
  const [showAllLearners, setShowAllLearners] = useState(false);
  // console.log("eeenrolled learner", enrolledLearner)
  // console.log("all leraners", enrolledLearnersByCourse)
  let dimensionScale = {
    width: 1000,
    height: 1000,
  }

  const xAccessor = (d) => Number(d.x)
  const yAccessor = (d) => Number(d.y)

  dimensionScale.ctrWidth = 1000
  dimensionScale.ctrHeight = 1000

  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, xAccessor))
    .range([15, dimensionScale.ctrWidth - 15])
    .clamp(true)

  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .range([dimensionScale.ctrHeight - 35, 35])
    .clamp(true)

  const loadData = async (courseId) => {
    const response = await getResponseGet(`/resources/${courseId}`);
    // console.log(response)
    if (response) {
      setData(response.data);
      // console.log(response.data)
      // console.log("this issss the data", data);
    }
  };
  const loadModuleData = async (courseId) => {
    const response = await getResponseGet(`/moduleData/${courseId}`);
    if (response) {
      setModuleData(response.data);
      // console.log("this is the module data", response.data);
    }
  };
  const loadJourney = async () => {
    const response = await getResponseGet(`/contributions/${enrollId}`);
    if (response) {
      setJourneyData(response.data);
      console.log("this is the learney journey data", response.data);
    }
  };
  useEffect(() => {
    loadData(courseId);
    loadModuleData(courseId);

  }, []);

  useEffect(() => {
    loadJourney();
  }, [enrollId]);

  const updateDimensions = () => {
    if (mapRef.current) {
      setDimensions({
        width: mapRef.current.offsetWidth,
        height: mapRef.current.offsetHeight,
      });
    }
  };


  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  const learnerPos = learnerPosState[0];

  return (
    <div
      className="learnerMapBody"
      ref={mapRef}
      style={{ position: "relative" }}
    >
      <SVGComponent
        width={dimensions.width}
        height={dimensions.height}
        svgRef={svgRef}
        zoomRef={zoomRef}
        setTransform={setTransform}
      >
        <GroupComponent>
          {showHex &&
            <HexModule
              data={data}
              xScale={xScale}
              yScale={yScale}
              inverseScale={inverseScale}
            />}
          {transform.k > 1 ?
            <>
              {data.length > 0 ? (
                data.map((d) => (
                  <React.Fragment key={d.id}>
                    <CircleComponent
                      data={d}
                      activitiesState={activitiesState}
                      tooltipRef={tooltipRef}
                      learnerPos={learnerPos}
                      coverageRadius={coverageRadius}
                      transform={transform}
                      enrollId={enrollId}
                      xScale={xScale}
                      yScale={yScale}
                      enrolledLearner={enrolledLearner}
                    />
                    <text
                      id={`text-${d.index}`}
                      x={xScale(d.x) - 5 * inverseScale}
                      y={yScale(d.y) - 20 * inverseScale}
                      fill="black"
                      fontSize={`${12 * inverseScale}px`}
                      fontFamily="sans-serif"
                    >
                      {d.index}
                    </text>
                    {/* Uncomment and modify this as needed */}
                    {/* <LineComponent
        startPos={d}
        endPos={d.id < data.length - 1 ? data[d.id + 1] : null}
      /> */}
                  </React.Fragment>
                ))
              ) : (
                <div>Loading Data...</div>
              )}

            </>
            :
            <>
              {moduleData.map((d) => (
                <React.Fragment key={d.module_id}>
                  <ModuleCircleComponent
                    moduleData={d}
                    activitiesState={activitiesState}
                    tooltipRef={tooltipRef}
                    // learnerPos={learnerPos}
                    // coverageRadius={coverageRadius}
                    transform={transform}
                    xScale={xScale}
                    yScale={yScale}
                  />
                  <text
                    id={`text-${d.id}`}
                    x={xScale(d.x) - 25 * inverseScale}
                    y={yScale(d.y) - 30 * inverseScale}
                    fill="black"
                    fontSize={`${15 * inverseScale}px`}
                    fontWeight={25}
                    fontFamily="sans-serif"
                  >
                    {`${(d.module).slice(0, 10)}...`}
                  </text>
                  {/* add line component */}
                  {/* <LineComponent
                startPos={d}
                endPos={d.id < data.length - 1 ? data[d.id + 1] : null}
              /> */}
                </React.Fragment>
              ))}
            </>}
          {enrolledLearnersByCourse.length > 0 ? (
            showAllLearners ? (
              enrolledLearnersByCourse.map((d) => (
                <React.Fragment key={d.enroll_id}>
                  <LearnerPositionComponent
                    learnerPosState={learnerPosState}
                    coverageRadius={coverageRadius}
                    transform={transform}
                    tooltipRef={tooltipRef}
                    xScale={xScale}
                    yScale={yScale}
                    enrolledLearner={d}
                    enrolledLearnersByCourse={enrolledLearnersByCourse}
                  />
                </React.Fragment>
              ))
            ) : (
              <LearnerPositionComponent
                learnerPosState={learnerPosState}
                coverageRadius={coverageRadius}
                transform={transform}
                tooltipRef={tooltipRef}
                xScale={xScale}
                yScale={yScale}
                enrolledLearner={enrolledLearner} // This would be the specific learner data to display
              />
            )
          ) : (
            <div>Loading or no data available</div>
          )}





          {journeyData && showJourney && (
            <JourneyMap journeyData={journeyData} tooltipRef={tooltipRef} transform={transform} xScale={xScale} yScale={yScale} />
          )}
        </GroupComponent>
      </SVGComponent>
      <ButtonPanel setShowHex={setShowHex} setShowJourney={setShowJourney} svgRef={svgRef} xScale={xScale} yScale={yScale} learnerPosState={learnerPosState} zoomRef={zoomRef} transform={transform} setShowAllLearners={setShowAllLearners} />


      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          border: "1px solid #ccc",
          padding: "8px",
          borderRadius: "4px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          pointerEvents: "none",
          visibility: "hidden",
          transition: "opacity 0.2s ease",
          fontSize: "12px",
          zIndex: 10,
        }}
      />
    </div>
  );
};

export default LearnerMap;
