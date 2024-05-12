import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import * as d3 from 'd3';
import 'mapbox-gl/dist/mapbox-gl.css';
import MyData from './data-1.json';

const scenes = [
    {
        name: "Scene 1",
        content: "Zoning laws determine not only the landscape of our communities but also the resources that schools can access. Areas with restrictive zoning often show disparities in school funding and student performance. How does your municipality compare?",
        additionalInfo: "",
        zoom: 9,
        center: [-71.0589, 42.3601],
        clickable: false
    },
    {
        name: "Scene 2",
        content: "Detailed view of Chelsea: Restrictive zoning limits educational opportunities.",
        additionalInfo: "In this scene, you'll explore the impact of restrictive zoning on educational opportunities in Chelsea. Learn about the challenges and opportunities for education in this municipality.",
        zoom: 13,
        center: [-71.0105, 42.3907],
        clickable: false
    },
    {
        name: "Scene 3",
        content: "Observing Cambridge and Brookline: Seeing the benefits of progressive zoning reforms on local schools.",
        additionalInfo: "This scene highlights the benefits of progressive zoning reforms on local schools in Somerville.",
        zoom: 12.5,
        center: [-71.0935, 42.3607],
        clickable: false
    },
    {
        name: "Map View",
        content: "Dive Deeper: Click on Any Municipality",
        additionalInfo: "This interactive map allows you to explore the zoning impact on education in Greater Boston municipalities. Click on a municipality to delve deeper into specific data and comparisons.",
        zoom: 9,
        center: [-71.0589, 42.3601],
        clickable: true
    }
];

const Statistics = (props) => {
    const { setOpenMap, setMapOpened } = props;
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [map, setMap] = useState(null);
    const [data, setData] = useState([]);

    useEffect(() => {
        mapboxgl.accessToken = "pk.eyJ1Ijoic2VsaW5kdXJzdW5uIiwiYSI6ImNsdmpucnN6YjFrYWYycm41cGxrNjNsNDMifQ.8ZNsKjRpCDRNEjV5AI4wRg";

        const newMap = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/selindursunn/clvjpb4wz069501pkdvkhb2i7',
            zoom: 10.85,
            center: [-71.0626, 42.3347],
            bearing: -25.4028,
            pitch: 48.6065,
            transformRequest: (url, resourceType) => {
                if (url.startsWith('http://api.mapbox.com') || url.startsWith('http://tiles.mapbox.com')) {
                    return {
                        url: url.replace("?", "?pluginName=dataJoins&")
                    }
                }
                return { url };
            }
        });

        setMap(newMap);

        setData(MyData);

        return () => newMap.remove();
    }, []);

    useEffect(() => {
        if (map) {
            map.flyTo({
                center: scenes[currentSceneIndex].center,
                zoom: scenes[currentSceneIndex].zoom,
            });

            updateChart(currentSceneIndex);
        }
    }, [currentSceneIndex, map, data]);

    const updateChart = (sceneIndex) => {
        const svg = d3.select("#chart").html('');
    
        if (!data.length) {
            console.log("Data is not loaded yet.");
            return;
        }
    
        const width = 500;
        const height = 300;
        const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    
        svg.attr("width", width)
            .attr("height", height);
    
        const x = d3.scaleBand()
            .domain(data.map(d => d.muni))
            .range([margin.left, width - margin.right])
            .padding(0.1);
    
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.z_score_education)])
            .range([height - margin.bottom, margin.top]);
    
        svg.append("g")
            .attr("fill", "steelblue")
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", d => x(d.muni))
            .attr("y", d => y(d.z_score_education))
            .attr("height", d => Math.max(0, y(0) - y(d.z_score_education)))
            .attr("width", x.bandwidth());
    
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x));
    
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));
    
        // svg.append("text")
        //     .attr("transform", "rotate(-90)")
        //     .attr("y", 0 - margin.left)
        //     .attr("x", 0 - (height / 2))
        //     .attr("dy", "1em")
        //     .style("text-anchor", "middle")
        //     .text("Z Score");
    
        // svg.append("text")
        //     .attr("transform", `translate(${width / 2}, ${height})`)
        //     .style("text-anchor", "middle")
        //     .text("Municipality");
    
        // svg.append("text")
        //     .attr("x", width / 2)
        //     .attr("y", 0 - (margin.top / 2))
        //     .attr("text-anchor", "middle")
        //     .style("font-size", "16px")
        //     .text("Z Score by Municipality");
    };

    const goToNextScene = () => {
        if (currentSceneIndex < scenes.length - 1) {
            setCurrentSceneIndex(currentSceneIndex + 1);
        }
    };

    const goToPreviousScene = () => {
        if (currentSceneIndex > 0) {
            setCurrentSceneIndex(currentSceneIndex - 1);
        }
    };

    const handleClick = () => {
        setOpenMap(null);
        setMapOpened(false);
        // setArchiveMapId(null);
    };

    return (
        <>
            <button style={{ position: 'absolute', top: 50, left: 20, zIndex: 11000, color: 'aliceblue' }} onClick={handleClick}>
                BACK
            </button>
            <div className="relative w-full h-full">
                <div id="map" className="absolute top-0 right-0 bottom-0 left-0"></div>
                <div id="info-bar" className="absolute top-5 right-5 h-[90%] w-1/3 bg-[rgba(1,0,21,0.75)] p-5 rounded-lg text-gray-300 text-sm flex flex-col justify-between">
                    <div>
                        <div id="municipality-name" className="text-lg font-bold text-white mb-5">{scenes[currentSceneIndex].content}</div>
                        <div id="additional-info">{scenes[currentSceneIndex].additionalInfo}</div>
                    </div>
                    <div className="flex justify-between items-center">
                        <button onClick={goToPreviousScene} disabled={currentSceneIndex === 0}>
                            <img src={"../images/left-arrow.png"} alt="Previous" className="w-6 h-6" />
                        </button>
                        <button onClick={goToNextScene} disabled={currentSceneIndex === scenes.length - 1}>
                            <img src={"../images/right-arrow.png"} alt="Next" className="w-6 h-6" />
                        </button>
                    </div>
                    <svg id="chart" className="w-full h-96 mt-8"></svg>
                    <div id="legend" className="mt-8">
        {/* <h4 className="text-lg">Legend:</h4> */}
        {/* Legends can be dynamically generated */}
    </div>
    <div className="text-center">
        <a href="https://map-datavizsociety.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline font-poppins">Click here for the more finished version</a>
    </div>
                </div>
            </div>
        </>
    );
};

export default Statistics;
