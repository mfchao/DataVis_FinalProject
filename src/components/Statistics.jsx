import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MyData from './data-1.json';
import BarChart from './BarChart';

const scenes = [
    {
        name: "Scene 1",
        content: "Zoning laws determine not only the landscape of our communities but also the resources that schools can access. Areas with restrictive zoning often show disparities in school funding and student performance. How does your municipality compare?",
        additionalInfo: "",
        zoom: 9,
        center: [-71.0589, 42.3601],
        clickable: false,
        muni_id: null 
    },
    {
        name: "Scene 2",
        content: "Detailed view of Chelsea: Restrictive zoning limits educational opportunities.",
        additionalInfo: "In this scene, you'll explore the impact of restrictive zoning on educational opportunities in Chelsea. Learn about the challenges and opportunities for education in this municipality.",
        zoom: 13,
        center: [-71.0105, 42.3907],
        clickable: false,
        muni_id: 57 
    },
    {
        name: "Scene 3",
        content: "Observing Cambridge and Brookline: Seeing the benefits of progressive zoning reforms on local schools.",
        additionalInfo: "This scene highlights the benefits of progressive zoning reforms on local schools in Somerville.",
        zoom: 12.5,
        center: [-71.0935, 42.3607],
        clickable: false,
        muni_id: 49 
    },
    {
        name: "Map View",
        content: "Dive Deeper: Click on Any Municipality",
        additionalInfo: "This interactive map allows you to explore the zoning impact on education in Greater Boston municipalities. Click on a municipality to delve deeper into specific data and comparisons.",
        zoom: 9,
        center: [-71.0589, 42.3601],
        clickable: true,
        muni_id: null
    }
];

const Statistics = (props) => {
    const { setOpenMap, setMapOpened } = props;
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [map, setMap] = useState(null);
    // const [data, setData] = useState([]);
    const [data, setData] = useState(MyData);

    const [selectedMunicipalityData, setSelectedMunicipalityData] = useState(data[0]); // Initialize with first data entry
    //const [selectedMunicipalityData, setSelectedMunicipalityData] = useState(null);
    
    const [lastClickedId, setLastClickedId] = useState(null);

    useEffect(() => {
        mapboxgl.accessToken = "pk.eyJ1Ijoic2VsaW5kdXJzdW5uIiwiYSI6ImNsdmpucnN6YjFrYWYycm41cGxrNjNsNDMifQ.8ZNsKjRpCDRNEjV5AI4wRg";
    
        const newMap = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/selindursunn/clvjpb4wz069501pkdvkhb2i7',
            zoom: scenes[1].zoom,
            center: scenes[1].center,
            bearing: -25.4028,
            pitch: 48.6065,
            transformRequest: (url, resourceType) => {
                if (url.startsWith('http://api.mapbox.com') || url.startsWith('http://tiles.mapbox.com')) {
                    return {
                        url: url.replace("?", "?pluginName=dataJoins&")
                    };
                }
                return { url };
            }
        });
    
        newMap.on('load', () => {
            newMap.dragRotate.enable();
            newMap.touchZoomRotate.enableRotation();
            
            newMap.addSource('ma-municipalities', {
                type: 'vector',
                url: 'mapbox://selindursunn.2lo7wkdx'
            });
    
            newMap.addLayer({
                id: 'municipalities-layer',
                type: 'fill',
                source: 'ma-municipalities',
                'source-layer': 'converted_ma_municipalities-bsbiz7',
                paint: {
                    'fill-color': [
                        'case',
                        ['boolean', ['feature-state', 'selected'], false],
                        // '#FF6347',
                        '#888888', // Color when selected
                        '#888888'  // Default color
                    ],
                    'fill-opacity': 0.2
                }
            });
    
            // Click event for selecting municipalities
            newMap.on('click', 'municipalities-layer', (e) => {
                if (e.features.length > 0) {
                    const muniId = e.features[0].properties.muni_id;
                    const muniData = data.find(muni => parseInt(muni.muni_id) === parseInt(muniId));
    
                    if (muniData) {
                        if (lastClickedId !== null) {
                            newMap.setFeatureState(
                                { source: 'ma-municipalities', sourceLayer: 'converted_ma_municipalities-bsbiz7', id: lastClickedId },
                                { selected: false }
                            );
                        }
    
                        newMap.setFeatureState(
                            { source: 'ma-municipalities', sourceLayer: 'converted_ma_municipalities-bsbiz7', id: muniId },
                            { selected: true }
                        );
    
                        setLastClickedId(muniId);
                        setSelectedMunicipalityData(muniData);
    
                        // Automatically adjust the scene index based on the clicked municipality
                        const sceneIndex = scenes.findIndex(scene => scene.muni_id === muniId);
                        setCurrentSceneIndex(sceneIndex !== -1 ? sceneIndex : 0);
                    }
                }
            });
    
            newMap.on('mouseenter', 'municipalities-layer', () => {
                newMap.getCanvas().style.cursor = 'pointer';
            });
    
            newMap.on('mouseleave', 'municipalities-layer', () => {
                newMap.getCanvas().style.cursor = '';
            });
    
            // Initially select Chelsea's data when the map loads
            const chelseaData = data.find(muni => muni.muni_id === scenes[0].muni_id);
            if (chelseaData) {
                setSelectedMunicipalityData(chelseaData);
                newMap.setFeatureState(
                    { source: 'ma-municipalities', sourceLayer: 'converted_ma_municipalities-bsbiz7', id: chelseaData.muni_id.toString() },
                    { selected: true }
                );
            }
        });
    
        setMap(newMap);
        return () => newMap.remove();
    }, [data]);  // Reacting to changes in 'data' might not be necessary if 'data' is static
    
        

    useEffect(() => {
        if (map) {
            map.flyTo({
                center: scenes[currentSceneIndex].center,
                zoom: scenes[currentSceneIndex].zoom
            });
    
            // Check if the current scene has a specific muni_id and find the data for it
            if (scenes[currentSceneIndex].muni_id) {
                const sceneData = data.find(muni => muni.muni_id === scenes[currentSceneIndex].muni_id);
                if (sceneData) {
                    setSelectedMunicipalityData(sceneData);
                }
            } else {
                // Set a default data object when there's no specific municipality data to display
                setSelectedMunicipalityData({
                    muni: "Explore the Map",
                    details: "Click any municipality to see detailed data."
                });
            }
        }
    }, [currentSceneIndex, map, data]);

    const handleNavigation = (direction) => {
        const newIndex = direction === 'next' ? Math.min(scenes.length - 1, currentSceneIndex + 1) : Math.max(0, currentSceneIndex - 1);
        setCurrentSceneIndex(newIndex);
    };

    // useEffect(() => {
    //     if (map) {
    //         map.flyTo({
    //             center: scenes[currentSceneIndex].center,
    //             zoom: scenes[currentSceneIndex].zoom,
    //         });

    //         // updateChart(currentSceneIndex);
    //     }
    // }, [currentSceneIndex, map, data]);

    // const updateChart = (sceneIndex) => {
    //     const svg = d3.select("#chart").html('');
    
    //     if (!data.length) {
    //         console.log("Data is not loaded yet.");
    //         return;
    //     }
    
    //     const width = 500;
    //     const height = 300;
    //     const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    
    //     svg.attr("width", width)
    //         .attr("height", height);
    
    //     const x = d3.scaleBand()
    //         .domain(data.map(d => d.muni))
    //         .range([margin.left, width - margin.right])
    //         .padding(0.1);
    
    //     const y = d3.scaleLinear()
    //         .domain([0, d3.max(data, d => d.z_score_education)])
    //         .range([height - margin.bottom, margin.top]);
    
    //     svg.append("g")
    //         .attr("fill", "steelblue")
    //         .selectAll("rect")
    //         .data(data)
    //         .join("rect")
    //         .attr("x", d => x(d.muni))
    //         .attr("y", d => y(d.z_score_education))
    //         .attr("height", d => Math.max(0, y(0) - y(d.z_score_education)))
    //         .attr("width", x.bandwidth());
    
    //     svg.append("g")
    //         .attr("transform", `translate(0,${height - margin.bottom})`)
    //         .call(d3.axisBottom(x));
    
    //     svg.append("g")
    //         .attr("transform", `translate(${margin.left},0)`)
    //         .call(d3.axisLeft(y));

    // };

    // const goToNextScene = () => {
    //     if (currentSceneIndex < scenes.length - 1) {
    //         setCurrentSceneIndex(currentSceneIndex + 1);
    //     }
    // };

    // const goToPreviousScene = () => {
    //     if (currentSceneIndex > 0) {
    //         setCurrentSceneIndex(currentSceneIndex - 1);
    //     }
    // };

    const goToNextScene = () => {
        const nextIndex = currentSceneIndex < scenes.length - 1 ? currentSceneIndex + 1 : currentSceneIndex;
        setCurrentSceneIndex(nextIndex);
        map.flyTo({ center: scenes[nextIndex].center, zoom: scenes[nextIndex].zoom });
    };

    const goToPreviousScene = () => {
        const prevIndex = currentSceneIndex > 0 ? currentSceneIndex - 1 : currentSceneIndex;
        setCurrentSceneIndex(prevIndex);
        map.flyTo({ center: scenes[prevIndex].center, zoom: scenes[prevIndex].zoom });
    };

    const handleClick = () => {
        setOpenMap(null);
        setMapOpened(false);
        // setArchiveMapId(null);
    };

    return (
        <>
            <button style={{ position: 'absolute', top: 50, left: 20, zIndex: 11000, color: 'aliceblue' }} onClick={() => setOpenMap(false)}>
                BACK
            </button>
            <div className="relative w-full h-full">
                <div id="map" className="absolute top-0 right-0 bottom-0 left-0"></div>
                {selectedMunicipalityData && (
                    <div className="absolute top-5 right-5 h-[90%] w-1/3 bg-[rgba(1,0,21,0.75)] p-5 rounded-lg text-gray-300 text-sm flex flex-col justify-between">
                        <BarChart data={selectedMunicipalityData} />
                        <h1 className="text-lg font-bold text-white mb-2">{selectedMunicipalityData.muni}</h1>
                        <div>{scenes[currentSceneIndex].additionalInfo}</div>
                        <div className="legend-container mt-4 mb-4">
    <h2 className="text-sm font-semibold mb-2">Legend</h2>
    <div className="flex items-center mb-1">
        <svg width="20" height="20">
            <circle cx="10" cy="10" r="8" fill="orange" filter="url(#yellowGlow)" />
            <defs>
                <filter id="yellowGlow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
        </svg>
        <span className="ml-2 text-xs">Niche Grades (C, D, F)</span>
    </div>
    <div className="flex items-center mb-1">
        <svg width="20" height="20">
            <circle cx="10" cy="10" r="8" fill="steelblue" filter="url(#blueGlow)" />
            <defs>
                <filter id="blueGlow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
        </svg>
        <span className="ml-2 text-xs">Niche Grades (A, B, C)</span>
    </div>
    <div className="flex items-center mb-1">
        <div style={{ width: '20px', height: '20px', backgroundColor: 'gray' }}></div>
        <span className="ml-2 text-xs">Average Median Z Score</span>
    </div>
    <div className="flex items-center">
        <div style={{ width: '20px', height: '20px', backgroundColor: 'white' }}></div>
        <span className="ml-2 text-xs">Actual Z Score</span>
    </div>
</div>

                        <div className="flex justify-between items-center">
                            <button onClick={() => handleNavigation('prev')} disabled={currentSceneIndex === 0}>
                                <img src="../images/left-arrow.png" alt="Previous" className="w-6 h-6" />
                            </button>
                            <button onClick={() => handleNavigation('next')} disabled={currentSceneIndex === scenes.length - 1}>
                                <img src="../images/right-arrow.png" alt="Next" className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
    
    
};

export default Statistics;