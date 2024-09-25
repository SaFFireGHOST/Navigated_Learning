import * as d3 from "d3";

const LearnerPositionComponent = ({
  tooltipRef,
  transform,
  xScale,
  yScale,
  enrolledLearner,
}) => {
  const pos = [enrolledLearner.x_coordinate, enrolledLearner.y_coordinate];
  const inverseScale = Math.min(1 / transform.k, 1.1);
  console.log("all learners are ", enrolledLearner)
  const handleMouseOver = (event) => {
    const tooltip = d3.select(tooltipRef.current);
    tooltip
      .style("visibility", "visible")
      .html(
        `<div>
            <strong>Learner:</strong><br>
            Position: ${pos[0].toFixed(3)}, ${pos[1].toFixed(3)}
          </div>`
      )
      .style("left", `${event.pageX + 15}px`)
      .style("top", `${event.pageY}px`);
  };

  const handleMouseMove = (event) => {
    const tooltip = d3.select(tooltipRef.current);
    tooltip
      .style("left", `${event.pageX + 15}px`)
      .style("top", `${event.pageY}px`);
  };

  const handleMouseOut = () => {
    const tooltip = d3.select(tooltipRef.current);
    tooltip.style("visibility", "hidden");
  };
  return (
    <>
      <g>
        {/* Rectangle with a border */}
        <rect
          x={xScale(pos[0])} // Adjust position to center the icon inside the rectangle
          y={yScale(pos[1])} // Adjust position
          width={30 * inverseScale} // Adjust width as needed
          height={30 * inverseScale} // Adjust height as needed
          fill="#ffbaba" // Fill color of the rectangle
          stroke="black" // Border color
          strokeWidth={2 * inverseScale} // Border width
          id="individual-point"
          onMouseOver={handleMouseOver}
          onMouseMove={handleMouseMove}
          onMouseOut={handleMouseOut}
        />

        {/* Font Awesome icon inside the rectangle */}
        <text
          x={xScale(pos[0]) + 15 * inverseScale} // Adjust to place the icon inside the rectangle
          y={yScale(pos[1]) + 15 * inverseScale} // Adjust to center the icon vertically
          fill="black"
          fontSize={`${20 * inverseScale}px`} // Adjust the size as needed
          fontFamily="FontAwesome"
          textAnchor="middle" // Center the icon horizontally
          dominantBaseline="middle" // Center the icon vertically
          onMouseOver={handleMouseOver}
          onMouseMove={handleMouseMove}
          onMouseOut={handleMouseOut}
        >
          {"\uf183"}
        </text>
        <text
          x={xScale(pos[0]) + 15 * inverseScale} // Align with the icon
          y={yScale(pos[1]) - 10 * inverseScale} // Place it slightly above the icon
          fill="black"
          fontSize={`${12 * inverseScale}px`} // Adjust the font size as needed
          textAnchor="middle"
        >
          {enrolledLearner.learner_name}
        </text>
      </g>


    </>
  );
};

export default LearnerPositionComponent;  