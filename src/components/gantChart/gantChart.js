import React, { useRef, useEffect, useState } from "react";
//import { select, axisBottom, axisRight, scaleLinear, scaleBand, timeScale } from 'd3';
import * as d3 from "d3";
import s from "./style.module.css";

function GantChart() {
  const fakedata = [
    {
      task: "conceptualize",
      type: "development",
      startTime: "2013-1-28", //year/month/day
      endTime: "2013-2-1",
      details: "This actually didn't take any conceptualization",
    },
    {
      task: "sketch",
      type: "development",
      startTime: "2013-2-1",
      endTime: "2013-2-6",
      details: "No sketching either, really",
    },
    {
      task: "color profiles",
      type: "development",
      startTime: "2013-2-6",
      endTime: "2013-2-9",
    },
    {
      task: "HTML",
      type: "coding",
      startTime: "2013-2-2",
      endTime: "2013-2-6",
      details: "all three lines of it",
    },
    {
      task: "write the JS",
      type: "coding",
      startTime: "2013-2-6",
      endTime: "2013-2-9",
    },
    {
      task: "advertise",
      type: "promotion",
      startTime: "2013-2-9",
      endTime: "2013-2-12",
      details: "This counts, right?",
    },
    {
      task: "spam links",
      type: "promotion",
      startTime: "2013-2-12",
      endTime: "2013-2-14",
    },
    {
      task: "eat",
      type: "celebration",
      startTime: "2013-2-8",
      endTime: "2013-2-13",
      details: "All the things",
    },
    {
      task: "crying",
      type: "celebration",
      startTime: "2013-2-13",
      endTime: "2013-2-16",
    },
  ];
  const w = 800;
  const h = 400;

  const [data, setData] = useState(fakedata);
  const svgRef = useRef();
  
  // will be called initially an on every data change
  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // const formatDate = (input, formatInput, formatOutput) => {
    //   var dateParse = d3.timeFormat(formatInput).parse;
    //   var dateFormat = d3.timeFormat(formatOutput);
    //   return dateFormat(dateParse(input));
    // }
    // //https://stackoverflow.com/questions/17721929/date-format-in-d3-js
    // formatDate("2003-01-01", "%Y-%m-%d", "%b-%Y"); // output -> "Jan-2003"

    const timeScale = d3.scaleTime([
        d3.min(data, (d) => d.startTime),
        d3.max(data, (d) => d.endTime),
      ])
      .range([0, w - 150]);

    let categories = [];
    for (let i = 0; i < data.length; i++) {
      categories.push(data[i].type);
    }

    const catsUnfiltered = categories; //for vert labels
    categories = checkUnique(categories);

    makeGant(data, w, h);

    // const title = svg
    //   .append("text")
    //   .text("Gantt Chart Process")
    //   .attr("x", w / 2)
    //   .attr("y", 25)
    //   .attr("text-anchor", "middle")
    //   .attr("font-size", 18)
    //   .attr("fill", "#009FFC");

   function makeGant(tasks, pageWidth, pageHeight) {
      const barHeight = 20;
      const gap = barHeight + 4;
      const topPadding = 75;
      const sidePadding = 75;

      const colorScale = d3.scaleLinear([0, categories.length], ["#00B9FA", "#F95002"])
        .interpolate(d3.interpolateHcl);

      makeGrid(sidePadding, topPadding, pageWidth, pageHeight);
      drawRects( tasks, gap, topPadding, sidePadding, barHeight, colorScale, pageWidth, pageHeight );
      vertLabels(gap, topPadding, sidePadding, barHeight, colorScale);
    };

    function drawRects( data, theGap, theTopPad, theSidePad, theBarHeight, theColorScale, w, h ) {
      const bigRects = svg
        .append("g")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", (d, i) => i * theGap + theTopPad - 2)
        .attr("width", (d) => w - theSidePad / 2)
        .attr("height", theGap)
        .attr("stroke", "none")
        .attr("fill", function (d) {
          for (var i = 0; i < categories.length; i++) {
            if (d.type === categories[i]) {
              return d3.rgb(theColorScale(i));
            }
          }
        })
        .attr("opacity", 0.2);

      const rectangles = svg.append("g").selectAll("rect").data(data).enter();

      const innerRects = rectangles
        .append("rect")
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("x", (d) => timeScale(d.startTime) + theSidePad)
        .attr("y", (d, i) => i * theGap + theTopPad)
        .attr("width", (d) => timeScale(d.endTime) - timeScale(d.startTime) )
        .attr("height", theBarHeight)
        .attr("stroke", "none")
        .attr("fill", function (d) {
          for (var i = 0; i < categories.length; i++) {
            if (d.type == categories[i]) {
              return d3.rgb(theColorScale(i));
            }
          }
        });

      const rectText = rectangles
        .append("text")
        .text((data) => data.task )
        .attr("x", (data) = (
            ( timeScale(data.endTime) -
              timeScale(data.startTime)) / 2 +
              timeScale(data.startTime) + theSidePad )
        )
        .attr("y", (d, i) => i * theGap + 14 + theTopPad )
        .attr("font-size", 11)
        .attr("text-anchor", "middle")
        .attr("text-height", theBarHeight)
        .attr("fill", "#fff");

      rectText.on('mouseover', (e) => {
          // console.log(this.x.animVal.getItem(this));
          let tag = "";
          console.log(d3.select(this).data());
          if (d3.select(this).data()[0].details !== undefined) {
            tag = "Task: " + d3.select(this).data()[0].task + "<br/>" + "Type: " + d3.select(this).data()[0].type + "<br/>" +
              "Starts: " + d3.select(this).data()[0].startTime + "<br/>" +
              "Ends: " + d3.select(this).data()[0].endTime + "<br/>" +
              "Details: " + d3.select(this).data()[0].details;
          } else {
            tag = "Task: " + d3.select(this).data()[0].task + "<br/>" +
              "Type: " + d3.select(this).data()[0].type + "<br/>" +
              "Starts: " + d3.select(this).data()[0].startTime + "<br/>" +
              "Ends: " + d3.select(this).data()[0].endTime;
          }
          const output = document.getElementById("tag");
          const x = this.x.animVal.getItem(this) + "px";
          const y = this.y.animVal.getItem(this) + 25 + "px";

          output.innerHTML = tag;
          output.style.top = y;
          output.style.left = x;
          output.style.display = "block";
        })
        .on("mouseout",  () => {
          var output = document.getElementById("tag");
          output.style.display = "none";
        });

      innerRects.on("mouseover",  (e) => {
          //console.log(this);
          let tag = "";
          if (d3.select(this).data()[0].details != undefined) {
            tag = "Task: " + d3.select(this).data()[0].task + "<br/>" +
              "Type: " + d3.select(this).data()[0].type + "<br/>" +
              "Starts: " +  d3.select(this).data()[0].startTime + "<br/>" +
              "Ends: " + d3.select(this).data()[0].endTime + "<br/>" +
              "Details: " + d3.select(this).data()[0].details;
          } else {
            tag = "Task: " + d3.select(this).data()[0].task + "<br/>" +
              "Type: " + d3.select(this).data()[0].type + "<br/>" +
              "Starts: " + d3.select(this).data()[0].startTime + "<br/>" +
              "Ends: " + d3.select(this).data()[0].endTime;
          }
          const output = document.getElementById("tag");
          const x = this.x.animVal.value + this.width.animVal.value / 2 + "px";
          const y = this.y.animVal.value + 25 + "px";

          output.innerHTML = tag;
          output.style.top = y;
          output.style.left = x;
          output.style.display = "block";
        })
        .on("mouseout",  () => {
          var output = document.getElementById("tag");
          output.style.display = "none";
        });
    };

    function makeGrid (theSidePad, theTopPad, w, h) {
      const xAxis = d3.axisBottom(timeScale)
          .ticks(d3.timer.days, 1)
          .tickSize(-h+theTopPad+20, 0, 0);
          //.tickFormat(d3.timer.format('%d %b'));
      const grid = svg.append('g')
          .attr('class', 'grid')
          .attr('transform', 'translate(' +theSidePad + ', ' + (h - 50) + ')')
          .call(xAxis)
          .selectAll("text")  
          .style("text-anchor", "middle")
          .attr("fill", "#000")
          .attr("stroke", "none")
          .attr("font-size", 10)
          .attr("dy", "1em");
      }
      
      function vertLabels (theGap, theTopPad, theSidePad, theBarHeight, theColorScale) {
        const numOccurances = [];
        let prevGap = 0;
      
        for (let i = 0; i < categories.length; i++){
          numOccurances[i] = [categories[i], getCount(categories[i], catsUnfiltered)];
        }
      
        const axisText = svg.append("g") //without doing this, impossible to put grid lines behind text
          .selectAll("text")
          .data(numOccurances)
          .enter()
          .append("text")
          .text((d) =>  d[0] )
          .attr("x", 10)
          .attr("y", (d, i) => {
            if (i > 0){
              for (let j = 0; j < i; j++){
                  prevGap += numOccurances[i-1][1];
                // console.log(prevGap);
                  return d[1]*theGap/2 + prevGap*theGap + theTopPad;
              }
            } else{
              return d[1]*theGap/2 + theTopPad;
            }
         })
         .attr("font-size", 11)
         .attr("text-anchor", "start")
         .attr("text-height", 14)
         .attr("fill", (d) => {
            for (var i = 0; i < categories.length; i++){
                if (d[0] === categories[i]){
                //  console.log("true!");
                  return d3.rgb(theColorScale(i)).darker();
                }
            }
         });
      
      }
      
      //from this stackexchange question: http://stackoverflow.com/questions/1890203/unique-for-arrays-in-javascript
      function checkUnique (arr) {
        const hash = {}, result = [];
          for ( let i = 0, l = arr.length; i < l; ++i ) {
              if ( !hash.hasOwnProperty(arr[i]) ) { //it works with objects! in FF, at least
                  hash[ arr[i] ] = true;
                  result.push(arr[i]);
              }
          }
          return result;
      }
      
      //from this stackexchange question: http://stackoverflow.com/questions/14227981/count-how-many-strings-in-an-array-have-duplicates-in-the-same-array
      function getCounts (arr) {
        let i = arr.length, // var to loop over
              obj = {}; // obj to store results
          while (i) obj[arr[--i]] = (obj[arr[i]] || 0) + 1; // count occurrences
          return obj;
      }
      
      // get specific from everything
      function getCount (word, arr) {
          return getCounts(arr)[word] || 0;
      }

  }, [data]);

  return (
    <>
      <h4 className={s.title}>Gantt Chart Process</h4>
      <svg ref={svgRef} className={s.gantsvg}></svg>
      <div id="tag"></div>
    </>
  );
}

export default GantChart;
