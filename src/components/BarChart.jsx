import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import MyData from './data-1.json';

const BarChart = ({ data }) => {
  const ref = useRef();

  const getMedian = (data, key) => {
    const values = data.map(item => item[key]).filter(value => !isNaN(value)).sort(d3.ascending);
    const mid = Math.floor(values.length / 2);
    return values.length % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
  };

  useEffect(() => {
    if (data && Object.keys(data).length !== 0) {
      const factor = 100;
      const medianEducation = getMedian(MyData, 'z_score_education') * factor;
      const medianHealth = getMedian(MyData, 'z_score_health') * factor;
      const medianSocial = getMedian(MyData, 'z_score_social') * factor;

      const formattedData = [
        { category: 'Education', values: [{ type: 'Selected', value: parseFloat((data.z_score_education * factor).toFixed(2)) }, { type: 'Median', value: parseFloat(medianEducation.toFixed(2)) }] },
        { category: 'Health', values: [{ type: 'Selected', value: parseFloat((data.z_score_health * factor).toFixed(2)) }, { type: 'Median', value: parseFloat(medianHealth.toFixed(2)) }] },
        { category: 'Social', values: [{ type: 'Selected', value: parseFloat((data.z_score_social * factor).toFixed(2)) }, { type: 'Median', value: parseFloat(medianSocial.toFixed(2)) }] }
      ];

      console.log("Formatted Data:", formattedData);
      drawChart(formattedData);
    }
  }, [data]);

  const drawChart = (formattedData) => {
    const margin = { top: 20, right: 30, bottom: 40, left: 90 };
    const width = 460 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    d3.select(ref.current).select("svg").remove();

    const svg = d3.select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x0 = d3.scaleBand()
      .range([0, width])
      .domain(formattedData.map(d => d.category))
      .paddingInner(0.1);

    const x1 = d3.scaleBand()
      .domain(['Selected', 'Median'])
      .range([0, x0.bandwidth()])
      .padding(0.05);

    const maxY = d3.max(formattedData, d => d3.max(d.values, v => Math.abs(v.value)));
    const y = d3.scaleLinear()
      .domain([-maxY, maxY])
      .range([height, 0])
      .nice();

    console.log("maxY:", maxY, "Y Scale Domain:", y.domain());

    const category = svg.selectAll(".category")
      .data(formattedData)
      .enter().append("g")
      .attr("class", "category")
      .attr("transform", d => `translate(${x0(d.category)}, 0)`);

    category.selectAll("rect")
      .data(d => d.values)
      .enter().append("rect")
      .attr("x", d => x1(d.type))
      .attr("y", d => y(Math.max(0, d.value)))
      .attr("width", x1.bandwidth())
      .attr("height", d => {
        const height = Math.abs(y(d.value) - y(0));
        if (isNaN(height)) {
          console.error("Invalid height calculation:", d);
        }
        return height;
      })
      .attr("fill", d => d.type === 'Selected' ? "rgba(255, 255, 255, 0.8)" : "rgba(220, 220, 220, 0.8)")
      .attr("rx", 5)
      .attr("ry", 5);
  };

  return (
    <div ref={ref}></div>
  );
};

export default BarChart;
