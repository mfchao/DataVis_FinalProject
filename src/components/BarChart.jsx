import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import MyData from './data-1.json';

const BarChart = ({ data }) => {
  const ref = useRef();

  // Function to calculate median values for each category
  const getMedian = (data, key) => {
    const values = data.map(item => item[key]).sort(d3.ascending);
    const mid = Math.floor(values.length / 2);
    return values.length % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
  };

  useEffect(() => {
    if (data) {
      const factor = 100; // Multiplication factor to scale the values
      const medianEducation = getMedian(MyData, 'z_score_education') * factor;
      const medianHealth = getMedian(MyData, 'z_score_health') * factor;
      const medianSocial = getMedian(MyData, 'z_score_social') * factor;

      const formattedData = [
        {
          category: 'Education',
          values: [
            {type: 'Selected', value: parseFloat((data.z_score_education * factor).toFixed(2))},
            {type: 'Median', value: parseFloat(medianEducation.toFixed(2))}
          ]
        },
        {
          category: 'Health',
          values: [
            {type: 'Selected', value: parseFloat((data.z_score_health * factor).toFixed(2))},
            {type: 'Median', value: parseFloat(medianHealth.toFixed(2))}
          ]
        },
        {
          category: 'Social',
          values: [
            {type: 'Selected', value: parseFloat((data.z_score_social * factor).toFixed(2))},
            {type: 'Median', value: parseFloat(medianSocial.toFixed(2))}
          ]
        }
      ];
      drawChart(formattedData);
    }
  }, [data]);  // Re-draw chart when data changes

  const drawChart = (data) => {
    const margin = { top: 20, right: 30, bottom: 40, left: 90 };
    const width = 460 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    d3.select(ref.current).select("svg").remove();  // Clear previous SVG

    const svg = d3.select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

          // Define the arrow marker
    svg.append('defs').append('marker')
    .attr('id', 'arrow')
    .attr('viewBox', '0 -5 10 10')  // Coordinates of the marker's bounding box
    .attr('refX', 6)                // x position of the reference point of the marker
    .attr('refY', 0)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')  // Path of the arrow shape
    .attr('fill', '#000');

    const x0 = d3.scaleBand()
      .range([0, width])
      .domain(data.map(d => d.category))
      .paddingInner(0.1);

    const x1 = d3.scaleBand()
      .domain(['Selected', 'Median'])
      .range([0, x0.bandwidth()])
      .padding(0.05);

    const maxY = Math.max(Math.abs(d3.min(data, d => d3.min(d.values, v => v.value))), d3.max(data, d => d3.max(d.values, v => v.value)));

    const y = d3.scaleLinear()
      .domain([-maxY, maxY]) // Symmetric domain around zero
      .range([height, 0])
      .nice();

    // Move the X-axis to always intersect at Y=0
    svg.append("g")
      .attr("transform", `translate(0,${y(0)})`)
      .call(d3.axisBottom(x0))
      .attr("marker-end", "url(#arrow)"); 


    svg.append("g")
      .call(d3.axisLeft(y))
      .attr("marker-end", "url(#arrow)"); 

    const category = svg.selectAll(".category")
      .data(data)
      .enter().append("g")
      .attr("class", "category")
      .attr("transform", d => `translate(${x0(d.category)}, 0)`);

      category.selectAll("rect")
      .data(d => d.values)
      .enter().append("rect")
      .attr("x", d => x1(d.type))
      .attr("y", d => y(Math.max(0, d.value)))
      .attr("width", x1.bandwidth())
      .attr("height", d => Math.abs(y(d.value) - y(0))) // Correct height calculation for positive and negative values
      // .attr("fill", d => d.type === 'Selected' ? "#ff8c00" : "#3182bd")
      // .attr("fill", d => d.type === 'Selected' ? "white" : "#3182bd")
      // .attr("fill", d => d.type === 'Selected' ? "white" : "#808080")  
      .attr("fill", d => d.type === 'Selected' ? "rgba(255, 255, 255, 1)" : "rgba(220, 220, 220, 0.4)")  // Add transparency
      .attr("rx", 5) // Set this to desired corner radius, adjust as needed
      .attr("ry", 5); // Set this to desired corner radius, adjust as needed
  };

  return (
    <div ref={ref}></div>
  );
};

export default BarChart;
