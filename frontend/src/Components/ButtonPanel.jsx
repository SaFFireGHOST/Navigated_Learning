import { ZoomIn, ZoomOut, Arrows, Play } from 'react-flaticons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    ButtonGroup,
    Button,
  } from "react-bootstrap";
  import * as d3 from "d3";  
const ButtonPanel=({setShowJourney,setShowHex,svgRef,xScale,yScale,learnerPosState,zoomRef,transform,setShowAllLearners})=>{
    return (
        <ButtonGroup style={{ position: "absolute", zIndex: "100", right: "10px", bottom: "10px" }}>
        <Button
          id="recentre"
          onClick={() => {
            const svg = d3.select(svgRef.current);
            const [x, y] = learnerPosState[0]; // Extract x and y coordinates
            const width = svg.node().getBoundingClientRect().width;
            const height = svg.node().getBoundingClientRect().height;

            svg
              .transition()
              .duration(750)
              .call(
                zoomRef.current.transform,

                d3.zoomIdentity
                  .translate(width / 2, height / 2) // Move the center of the map
                  .scale(transform.k)
                  .translate(-xScale(x), -yScale(y)) // Translate the map based on the user's position
              );
          }}
        >

          <span>
            <FontAwesomeIcon style={{ fontSize: "25px", color: "black", verticalAlign: "middle" }} icon="location-crosshairs" size="xs" />
          </span>


        </Button>

        <Button
          id="zoomIn"
          onClick={() => {
            const svg = d3.select(svgRef.current);
            // svg.style("cursor", "zoom-in"); // Change cursor to zoom-in
            svg.transition()
              .duration(750)
              .call(
                zoomRef.current.scaleBy,
                1.5 // Zoom in by a factor of 1.1
              );
          }}
        >
          <span><ZoomIn color="black"></ZoomIn></span>

        </Button>

        <Button
          id="zoomOut"
          onClick={() => {
            const svg = d3.select(svgRef.current);
            // svg.style("cursor", "zoom-out"); // Change cursor to zoom-in
            svg.transition()
              .duration(750)
              .call(
                zoomRef.current.scaleBy,
                1 / 1.5 // Zoom in by a factor of 1.1
              );
          }}
        >
          <span><ZoomOut color="black"></ZoomOut></span>
        </Button>

        <Button
          id="Move"
          onClick={() => {
            const svg = d3.select(svgRef.current);
            svg.style("cursor", "move"); // Change cursor to zoom-in
          }}
        >
          <span><Arrows color="black"></Arrows></span>
        </Button>
        <Button id="Play" onClick={() => {
          setShowJourney(curr => !curr);
        }}>
          <span><Play color="black"></Play></span>
        </Button>
        <Button onClick={() => {
          setShowHex(curr => !curr);
        }}>
          <span style={{ color: "black" }}> Show region</span>

        </Button>
        <Button onClick={() => {
          setShowAllLearners(curr => !curr);
        }}>
          <span style={{ color: "black" }}> Show All Learners</span>

        </Button>
      </ButtonGroup>
    )
    
}


export default ButtonPanel;
