import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';

const PolylineChart = ({ polyline, moduleData }) => {
  console.log("polyline in chart is ", polyline);
  console.log("module chart", moduleData);
  const [tooltip, setTooltip] = useState({ display: false, x: 0, y: 0, value: 0 });

  const svgWidth = 500;
  const svgHeight = 300;
  const padding = 60;

  // Y-axis labels for 0, 0.25, 0.5, 0.75, and 1
  const yAxisLabels = [1, 0.75, 0.5, 0.25, 0];

  // Map the polyline values directly (since they are between 0 and 1)
  const points = [];
  polyline.forEach((value, index) => {
    // Update: Start the x-coordinate calculation from index + 1
    const x = padding + ((index + 1) / polyline.length) * (svgWidth - 2 * padding);
    const y = svgHeight - padding - value * (svgHeight - 2 * padding); // scale value to fit the chart
    if (index > 0) {
      const prevX = padding + (index / polyline.length) * (svgWidth - 2 * padding);
      points.push(`${prevX},${y}`); // Horizontal line
    }
    points.push(`${x},${y}`); // Vertical line or move to next point
  });

  // Tooltip event handlers
  const handleMouseEnter = (event, value) => {
    setTooltip({ display: true, x: event.clientX, y: event.clientY, value });
  };

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, display: false });
  };

  return (
    <div>
      <svg width={svgWidth} height={svgHeight} style={{ border: '1px solid black' }}>
        {/* Axes */}
        <line x1={padding} y1={padding} x2={padding} y2={svgHeight - padding} stroke="black" />
        <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="black" />

        {/* Y-Axis Labels and Grid Lines */}
        {yAxisLabels.map((label, index) => {
          const y = svgHeight - padding - label * (svgHeight - 2 * padding);
          return (
            <g key={index}>
              {/* Label */}
              <text x={padding - 10} y={y} textAnchor="end" dominantBaseline="middle">{label}</text>
              {/* Horizontal grid line */}
              <line
                x1={padding}
                x2={svgWidth - padding}
                y1={y}
                y2={y}
                stroke="lightgray"
                strokeDasharray="5, 5"
              />
            </g>
          );
        })}

        {/* X-Axis Labels and Grid Lines */}
        {polyline.map((_, index) => {
          // Update: Start the x-coordinate calculation from index + 1
          const x = padding + ((index + 1) / polyline.length) * (svgWidth - 2 * padding);
          return (
            <g key={index}>
              {/* Label */}
              <text x={x} y={svgHeight - padding + 20} textAnchor="middle">{index + 1}</text>
              {/* Vertical grid line */}
              <line
                x1={x}
                x2={x}
                y1={padding}
                y2={svgHeight - padding}
                stroke="lightgray"
                strokeDasharray="5, 5"
              />
            </g>
          );
        })}

        {/* Y-Axis Title */}
        <text x={padding - 50} y={svgHeight / 2} textAnchor="middle" dominantBaseline="middle" transform={`rotate(-90, ${padding - 50}, ${svgHeight / 2})`} >Proficiency</text>

        {/* X-Axis Title */}
        <text x={svgWidth / 2} y={svgHeight - padding + 40} textAnchor="middle">Topic Index</text>

        {/* Step Polyline */}
        <polyline
          points={points.join(' ')}
          style={{ fill: 'none', stroke: 'blue', strokeWidth: 2 }}
        />

        {/* Circles on the points to trigger tooltip */}
        {polyline.map((value, index) => {
          // Update: Start the x-coordinate calculation from index + 1
          const x = padding + ((index + 1) / polyline.length) * (svgWidth - 2 * padding);
          const y = svgHeight - padding - value * (svgHeight - 2 * padding);
          return (
            <Tooltip title={
              <>
                Proficiency: {value.toFixed(3)} <br />
                Topic: {moduleData[index].name}
              </>
            } arrow key={index}>
              <circle
                cx={x}
                cy={y}
                r={4}
                fill="blue"
                stroke="blue"
                strokeWidth={2}
                onMouseEnter={(e) => handleMouseEnter(e, value)}
                onMouseLeave={handleMouseLeave}
              />
            </Tooltip>
          );
        })}
      </svg>
    </div>
  );
};

export default PolylineChart;
