import React, { useEffect } from 'react';
import * as d3 from 'd3';

const JourneyMap = ({ journeyData, tooltipRef, transform, xScale, yScale }) => {
  const newJourneyData = [{ x_coordinate: 0.1, y_coordinate: 0.1 }, ...journeyData];

  const handleMouseOver = (event, point) => {
    const tooltip = d3.select(tooltipRef.current);
    tooltip
      .style('visibility', 'visible')
      .html(
        `
        <div>
          <strong>Position:</strong> ${point.x_coordinate.toFixed(3)}, ${point.y_coordinate.toFixed(3)}
        </div>
        `
      )
      .style('display', 'block')
      .style('left', `${xScale(point.x_coordinate)}px`)
      .style('top', `${yScale(point.y_coordinate)}px`);
  };

  const handleMouseMove = (event, point) => {
    const tooltip = d3.select(tooltipRef.current);
    tooltip
      .style('left', `${xScale(point.x_coordinate)}px`)
      .style('top', `${yScale(point.y_coordinate)}px`);
  };

  const handleMouseOut = () => {
    const tooltip = d3.select(tooltipRef.current);
    tooltip.style('visibility', 'hidden');
  };

  const inverseScale = Math.min(1 / transform.k, 1.1);

  // Handle only scaling changes without transitions
  useEffect(() => {
    newJourneyData.forEach((point, index) => {
      // Update the rectangles and icons instantly when zoom level changes
      d3.select(`#rect-${index}`)
        .attr('width', 30 * inverseScale)
        .attr('height', 30 * inverseScale)
        .attr('stroke-width', 2 * inverseScale);

      d3.select(`#icon-${index}`)
        .attr('x', xScale(point.x_coordinate) + 15 * inverseScale)
        .attr('y', yScale(point.y_coordinate) + 15 * inverseScale)
        .attr('font-size', `${20 * inverseScale}px`);

      if (index > 0) {
        d3.select(`#path-${index - 1}`)
          .attr('stroke-width', 2 * inverseScale);
      }
    });
  }, [inverseScale, newJourneyData, xScale, yScale]);

  // Animate on journeyData changes only
  useEffect(() => {
    newJourneyData.forEach((point, index) => {
      d3.select(`#rect-${index}`)
        .transition()
        .delay(index * 1000)
        .duration(500)
        .style('opacity', 1);

      d3.select(`#icon-${index}`)
        .transition()
        .delay(index * 1000)
        .duration(500)
        .style('opacity', 1);

      if (index > 0) {
        d3.select(`#path-${index - 1}`)
          .transition()
          .delay(index * 1000)
          .duration(500)
          .style('opacity', 1);
      }
    });
  }, [newJourneyData]);

  const lineGenerator = (pointA, pointB) => {
    const x1 = xScale(pointA.x_coordinate) + 15 * inverseScale;
    const y1 = yScale(pointA.y_coordinate) + 15 * inverseScale;
    const x2 = xScale(pointB.x_coordinate) + 15 * inverseScale;
    const y2 = yScale(pointB.y_coordinate) + 15 * inverseScale;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const dr = Math.sqrt(dx * dx + dy * dy);
    const offset = 50 * inverseScale;

    const cx = (x1 + x2) / 2 + (dy / dr) * offset;
    const cy = (y1 + y2) / 2 - (dx / dr) * offset;

    return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  };

  return (
    <g>
      {newJourneyData.map((point, index) => (
        <g key={index}>
          <rect
            id={`rect-${index}`}
            x={xScale(point.x_coordinate)}
            y={yScale(point.y_coordinate)}
            width={0}
            height={0}
            fill="#ffbaba"
            stroke="black"
            strokeWidth={2 * inverseScale}
            style={{ opacity: 0 }}
            onMouseOver={(event) => handleMouseOver(event, point)}
            onMouseMove={(event) => handleMouseMove(event, point)}
            onMouseOut={handleMouseOut}
          />
          <text
            id={`icon-${index}`}
            x={xScale(point.x_coordinate) + 15 * inverseScale}
            y={yScale(point.y_coordinate) + 15 * inverseScale}
            fill="black"
            fontSize={`${20 * inverseScale}px`}
            fontFamily="FontAwesome"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ opacity: 0 }}
            onMouseOver={(event) => handleMouseOver(event, point)}
            onMouseMove={(event) => handleMouseMove(event, point)}
            onMouseOut={handleMouseOut}
          >
            {"\uf183"}
          </text>
        </g>
      ))}
      {newJourneyData.slice(0, -1).map((point, index) => {
        const nextPoint = newJourneyData[index + 1];
        const pathData = lineGenerator(point, nextPoint);

        return (
          <path
            key={`path-${index}`}
            id={`path-${index}`}
            d={pathData}
            stroke="black"
            strokeWidth={2 * inverseScale}
            strokeDasharray="4,4"
            fill="none"
            markerEnd="url(#arrow)"
            style={{ opacity: 0 }}
          />
        );
      })}
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="10"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="black" />
        </marker>
      </defs>
    </g>
  );
};

export default JourneyMap;
