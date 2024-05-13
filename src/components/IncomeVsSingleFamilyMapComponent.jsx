import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import Papa from 'papaparse';
import 'mapbox-gl/dist/mapbox-gl.css';


mapboxgl.accessToken = "pk.eyJ1Ijoic2VsaW5kdXJzdW5uIiwiYSI6ImNsdmpucnN6YjFrYWYycm41cGxrNjNsNDMifQ.8ZNsKjRpCDRNEjV5AI4wRg";

const IncomeVsSingleFamilyMapComponent = (props) => {
  const mapRef = useRef(null);
  const animationRef = useRef(null);
  const [sceneloaded, setSceneLoaded] = useState(false);
  const [index, setIndex] = useState(null);

  const { setOpenMap, setMapOpened, scroll } = props;

  const incomeLevels = ["incu10", "inc1015", "inc1520", "inc2025", "inc2530", "inc3035", "inc3540", "inc4045",
    "inc4550", "inc5060", "inc6075", "i7599", "i100125", "i125150", "i150200", "in200o"]
  // These are for labels above the sliders
  const incomeLevelTextLow = ["$0", "$10,000", "$15,000", "$20,000", "$25,000", "$30,000", "$35,000", "$40,000", "$45,000", "$50,000", "$60,000", "$75,000", "$100,000", "$125,000", "$150,000", "$200,000"];
  const incomeLevelTextHigh = ["$10,000", "$15,000", "$20,000", "$25,000", "$30,000", "$35,000", "$40,000", "$45,000", "$50,000", "$60,000", "$75,000", "$100,000", "$125,000", "$150,000", "$200,000", "INF"];

  const [minIndex, setMinIndex] = useState(14);
  const [maxIndex, setMaxIndex] = useState(15);
  const [showSliders, setShowSliders] = useState(false);
  const [zoom, setZoom] = useState(9.61);
  const [center, setCenter] = useState([-71.0913, 42.47]);
  const [bearing, setBearing] = useState(-83);
  const [pitch, setPitch] = useState(55);
  const [selectedRange, setSelectedRange] = useState(2);

  useEffect(() => {

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/selindursunn/clvmvhh2z045m01pefzng2rzp',
      zoom: zoom,
      center: center,
      bearing: bearing,
      pitch: pitch,
      transformRequest: (url, resourceType) => {
        if (url.startsWith('http://api.mapbox.com') || url.startsWith('http://tiles.mapbox.com')) {
          return {
            url: url.replace("?", "?pluginName=dataJoins&")
          }
        }
        return { url };
      },
      scrollZoom: false
    });

    const csvUrl =
      "https://raw.githubusercontent.com/hannohiss/Vis-Mapbox-Website/main/housing_sf_other_w_census.csv"
    const csvPromise = papaPromise(csvUrl);

    map.on("load", function () {
      updateIncomeDisplay();
      updateVisualization(minIndex, maxIndex);
      csvPromise.then(function (results) {
        results.data.forEach((row) => {
          var totalPop = 0
          //calculate sum of population for each municipality
          incomeLevels.forEach((level) => {
            totalPop += parseInt(row[level]);
          })

          map.setFeatureState(
            {
              // your source tileset and source layer
              source: "mass-muni",
              sourceLayer: "ma_municipalities_degrees-8uvqwo",
              // unqiue ID row name
              id: row.muni_id,
            },
            //YOUR TURN: Add rows you want to style/interact with
            {
              municipal: row.muni,
              single_family: row.only_single_family * 100,
              // This is the query for "%_single_family", round to 2 decimal places
              percentage_single_family: Math.round(row["%_single_family"] * 100) / 100,
              incu10: 100 * row["incu10"] / totalPop,
              inc1015: 100 * row["inc1015"] / totalPop,
              inc1520: 100 * row["inc1520"] / totalPop,
              inc2025: 100 * row["inc2025"] / totalPop,
              inc2530: 100 * row["inc2530"] / totalPop,
              inc3035: 100 * row["inc3035"] / totalPop,
              inc3540: 100 * row["inc3540"] / totalPop,
              inc4045: 100 * row["inc4045"] / totalPop,
              inc4550: 100 * row["inc4550"] / totalPop,
              inc5060: 100 * row["inc5060"] / totalPop,
              inc6075: 100 * row["inc6075"] / totalPop,
              i7599: 100 * row["i7599"] / totalPop,
              i100125: 100 * row["i100125"] / totalPop,
              i125150: 100 * row["i125150"] / totalPop,
              i150200: 100 * row["i150200"] / totalPop,
              in200o: 100 * row["in200o"] / totalPop,
            }
          );
        });
      });

      // YOUR TURN: Add source layer
      map.addSource("mass-muni", {
        type: "vector",
        url: "mapbox://hannohiss.890zal4l",
        promoteId: "muni_id",
      });

      map.addLayer({
        id: "mass-muni-extrusion",
        type: "fill-extrusion",
        source: "mass-muni",
        "source-layer": "ma_municipalities_degrees-8uvqwo",
        maxzoom: 15,
        paint: {
          // Use an 'interpolate' expression to scale the height of the extrusion
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['feature-state', 'incomeWithinRange'],
            0, 0, // Assuming population is 0, height is 0
            100, 5000 // Scale up height with population, adjust as needed
          ],
          'fill-extrusion-base': 0, // Base of the extrusions
          'fill-extrusion-opacity': 1, // Adjust the opacity as needed
          // Maintain the color from the existing layer
          'fill-extrusion-color': [
            'interpolate',
            ['linear'],
            ['feature-state', 'percentage_single_family'],
            0, '#6BA0C7', // Start color for 0%
            100, '#CE575E'  // End color for 100%
          ]
        }
      });


      map.addLayer({
        id: "mass-muni-line",
        type: "line",
        source: "mass-muni",
        "source-layer": "ma_municipalities_degrees-8uvqwo",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#D8CAC1",
          "line-width": .11,
        },
      });

      var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      map.on("mousemove", "mass-muni-extrusion", function (e) {
        map.getCanvas().style.cursor = "pointer";

        var muni = map.queryRenderedFeatures(e.point, {
          layers: ["mass-muni-extrusion"],
        });

        var FeatureState = muni[0].state; // Feature state
        var content = "";
        content += "<b>" + FeatureState["municipal"] + "</b>" + "<br>";
        // content += "<b>" + Math.round(FeatureState["percentage_single_family"]) + "% </b>" + "Single Family Homes" + "<br>";
        popup.setLngLat(e.lngLat).setHTML(content).addTo(map);
      });

      map.on("mouseleave", "muni-fill", function () {
        map.getCanvas().style.cursor = "";
        popup.remove();
      });

      // Event listener to log camera position, zoom level, and bearing
      map.on('moveend', () => {
        const center = map.getCenter();
        const zoom = map.getZoom();
        const bearing = map.getBearing();
        const pitch = map.getPitch();
        console.log(`Map center: Latitude ${center.lat}, Longitude ${center.lng}`);
        console.log(`Zoom level: ${zoom}`);
        console.log(`Bearing: ${bearing} degrees`);
        console.log(`Pitch: ${pitch} degrees`)
      });
      mapRef.current = map;


    });



    function updateVisualization(minIndex, maxIndex) {
      csvPromise.then(function (results) {
        results.data.forEach((row) => {
          var totalPop = 0;
          incomeLevels.forEach((level) => {
            totalPop += parseInt(row[level], 10) || 0;
          });

          var totalIncomeWithinRange = 0;
          for (let i = minIndex; i <= maxIndex; i++) {
            totalIncomeWithinRange += parseInt(row[incomeLevels[i]], 10) || 0;
          }

          map.setFeatureState({
            source: "mass-muni",
            sourceLayer: "ma_municipalities_degrees-8uvqwo",
            id: row.muni_id,
          }, {
            incomeWithinRange: (totalIncomeWithinRange / totalPop) * 100,
          });
        });
      });
    }

    const updateIncomeDisplay = () => {
      const minIndex = parseInt(document.getElementById('incomeLevelMin').value);
      const maxIndex = parseInt(document.getElementById('incomeLevelMax').value);
      console.log(minIndex, maxIndex);
      const selectedRangeText = `${incomeLevelTextLow[minIndex]} - ${incomeLevelTextHigh[maxIndex]}`;
      document.getElementById('selectedIncomeRange').textContent = selectedRangeText;
      updateVisualization(minIndex, maxIndex);
    };

    const SetIncomeRangeAndView = (min, max, button) => {
      setMinIndex(min);
      setMaxIndex(max);
      updateVisualization(min, max)
      if (button == "low") {
        setSelectedRange(0);
      }
      if (button == "mid") {
        setSelectedRange(1);
      }
      if (button == "high") {
        setSelectedRange(2);
      }
    };








    const incomeLevelMin = document.getElementById('incomeLevelMin');
    const incomeLevelMax = document.getElementById('incomeLevelMax');
    const lowIncomeGroup = document.getElementById('lowIncomeGroup');
    const midIncomeGroup = document.getElementById('midIncomeGroup');
    const highIncomeGroup = document.getElementById('highIncomeGroup');

    const lowClickHandler = () => {
      SetIncomeRangeAndView(0, 9, "low");
      mapRef.current.flyTo({  // Step 3: Use the ref to access the map instance
        center: [-70.882, 42.442],
        zoom: 9.7,
        bearing: 38.23,
        pitch: 75.1,
        essential: true,
        speed: 0.3
      });
    };
    const midClickHandler = () => {
      SetIncomeRangeAndView(10, 13, "mid");
      mapRef.current.flyTo({  // Step 3: Use the ref to access the map instance
        center: [-71.047, 42.357],
        zoom: 9.58,
        bearing: 52.94,
        pitch: 66.6,
        essential: true,
        speed: 0.3
      });
    }
    const highClickHandler = () => {
      SetIncomeRangeAndView(14, 15, "high");
      mapRef.current.flyTo({  // Step 3: Use the ref to access the map instance
        center: [-71.088, 42.411],
        zoom: 9.89,
        bearing: -85.788,
        pitch: 63.595,
        essential: true,
        speed: 0.3
      });
    }

    if (index) {
      if (index == 0) {
        lowClickHandler();
        setIndex(null)
      } else if (index == 1) {
        midClickHandler();
        setIndex(null)
      } else if (index == 2) {
        highClickHandler();
        setIndex(null)
      }
    }

    if (incomeLevelMin && incomeLevelMax) {
      incomeLevelMin.addEventListener('input', updateIncomeDisplay);
      incomeLevelMax.addEventListener('input', updateIncomeDisplay);
      lowIncomeGroup.addEventListener('click', lowClickHandler);
      midIncomeGroup.addEventListener('click', midClickHandler);
      highIncomeGroup.addEventListener('click', highClickHandler);
    }

    return () => {
      if (incomeLevelMin && incomeLevelMax) {
        incomeLevelMin.removeEventListener('input', updateIncomeDisplay);
        incomeLevelMax.removeEventListener('input', updateIncomeDisplay);
        lowIncomeGroup.removeEventListener('click', lowClickHandler);
        midIncomeGroup.removeEventListener('click', midClickHandler);
        highIncomeGroup.removeEventListener('click', highClickHandler);
        map.remove();
      }
      cancelAnimationFrame(animationRef.current);

    };


  }, [index]);


  function updateScrollScene(index) {
    if (index == 0) {
      setIndex(0)
    } else if (index == 1) {
      setIndex(1)
    } else if (index == 2) {
      setIndex(2)
    } else {
      setIndex(null)
    }
  }
  useEffect(() => {
    const updateScene = () => {
      if (scroll > 0.87 && scroll < 0.88) {
        updateScrollScene(0);
      } else if (scroll > 0.89 && scroll < 0.90) {
        updateScrollScene(1);
      } else if (scroll > 0.91 && scroll < 0.92) {
        updateScrollScene(2);
      }
      animationRef.current = requestAnimationFrame(updateScene);
    }

    animationRef.current = requestAnimationFrame(updateScene);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [scroll]);






  const papaPromise = (url) => new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: resolve,
      error: reject
    });
  });

  const handleMinChange = (event) => {
    const newMinIndex = parseInt(event.target.value);
    setMinIndex(newMinIndex);
    if (newMinIndex >= maxIndex) {
      setMaxIndex(newMinIndex + 1);
    }
  };

  const handleMaxChange = (event) => {
    const newMaxIndex = parseInt(event.target.value);
    setMaxIndex(newMaxIndex);
    if (newMaxIndex <= minIndex) {
      setMinIndex(newMaxIndex - 1);
    }
  };

  const handleClick = () => {
    setOpenMap(null);
    setMapOpened(false);
    // setArchiveMapId(null);
  };

  const toggleSliders = () => {
    setShowSliders(!showSliders);
    setSelectedRange(-1);
  }


  return (
    <div>
      <button style={{ position: 'absolute', top: 50, left: 20, zIndex: 11000, color: 'aliceblue' }}
        onClick={handleClick}>
        BACK
      </button>
      
      <div id="map" style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }}></div>
      <div id="info-bar" style={{
        position: 'absolute',
        top: '20px', right: '20px', height: '90%', width: '35%', backgroundColor: 'rgba(1, 0, 21, 0.75)', padding: '10px', paddingTop: '20px',
        boxSizing: 'border-box', borderRadius: '10px', fontStyle: 'Poppins', fontSize: '14px', color: 'rgb(218, 218, 218)'
      }}>
        <div id="municipality-name" style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', padding: '0px', marginBottom: '20px' }}>Staggering income disparities between municipalities across the Boston Metropolitan Area.</div>
        <div id="additional-info" style={{}}>
          In 2018 - 2022 , the median value of an owner-occupied home was $684,900 and median gross rent $1,981, while the median income in the same timeframe was $89,212. In 1960, 8 years before the 1968 Fair Housing Act outlawed redlining, the median price of an owner-occupied house was $15,900 and median gross rent was $82 dollars. The median regional income for white families at that time was $5,835 while for nonwhite families it was $3,233.
          <br />
          Those who had the upper hand in property ownership in the 1960s have accumulated a massive amount of wealth through no more than land ownership. The inability to increase housing in these regions through single-family zoning has artificially created a limited supply for a very real growing demand for housing, creating a nearly impassible financial barrier to mobility that replaced that which was established with historical redlining.
        </div>

        <style>
          {`
        .range-btn {
          padding: 1px 2px;
          margin: 5px;
          background-color: black;
          border: 2px solid #ccc;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .range-btn.selected {
          color: white;
          border-color: blue;
        }
        .range-btn:hover {
          background-color: #e2e2e2;
        }
      `}
        </style>
        <div>
          <button className={`range-btn ${selectedRange === 0 ? "selected" : ""}`} id="lowIncomeGroup">Lowest 1/3 Income (0-60k)</button>
          <br />
          <button className={`range-btn ${selectedRange === 1 ? "selected" : ""}`} id="midIncomeGroup">Medium 1/3 Income (60-150k)</button>
          <br />
          <button className={`range-btn ${selectedRange === 2 ? "selected" : ""}`} id="highIncomeGroup">Highest 1/3 Income (150k+)</button>
          <br />
          <button className={`range-btn ${selectedRange === 3 ? "selected" : ""}`} onClick={toggleSliders} id="customRange">custom range</button>
          {/* Existing UI elements */}
        </div>

        <div style={{ visibility: showSliders ? 'visible' : 'hidden' }}>
          Selected Income Range: <span id="selectedIncomeRange"></span>
          <br />
          <input type="range" id="incomeLevelMin" min="0" max="15" value={minIndex} onChange={handleMinChange} step="1" style={{ width: 200 }} />
          <input type="range" id="incomeLevelMax" min="0" max="15" value={maxIndex} onChange={handleMaxChange} step="1" style={{ width: 200 }} />

        </div>

        <div id="legend" style={{ padding: '5px' }}>
          <h4 style={{ fontSize: 'larger' }}>
            Legend:
          </h4>
          <div>
            <p>
              Percent of household incomes within the selected range is represented as height.
              <br />
              Percentage of housing zoned for single-family only is shown as blue to red for 0 to 100%.

            </p>
          </div>

        </div>
      </div>


    </div >
  )
};

export default IncomeVsSingleFamilyMapComponent;
