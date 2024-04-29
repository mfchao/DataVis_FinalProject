import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Papa from 'papaparse';
import 'mapbox-gl/dist/mapbox-gl.css';


mapboxgl.accessToken = "pk.eyJ1IjoiaGFubm9oaXNzIiwiYSI6ImNsdWd6NnNtNzBjaGkybHAyMXAwZW95dnYifQ.ugCpnrkxesS79JfAl9fhJw";

const IncomeVsSingleFamilyMapComponent = () => {
  const incomeLevels = ["incu10", "inc1015", "inc1520", "inc2025", "inc2530", "inc3035", "inc3540", "inc4045",
    "inc4550", "inc5060", "inc6075", "i7599", "i100125", "i125150", "i150200", "in200o"]
  // These are for labels above the sliders
  const incomeLevelTextLow = ["$0", "$10,000", "$15,000", "$20,000", "$25,000", "$30,000", "$35,000", "$40,000", "$45,000", "$50,000", "$60,000", "$75,000", "$100,000", "$125,000", "$150,000", "$200,000"];
  const incomeLevelTextHigh = ["$10,000", "$15,000", "$20,000", "$25,000", "$30,000", "$35,000", "$40,000", "$45,000", "$50,000", "$60,000", "$75,000", "$100,000", "$125,000", "$150,000", "$200,000", "INF"];

    const [minIndex, setMinIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(15);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v11',
      zoom: 7.5,
      center: [-71, 42.2],
      transformRequest: (url, resourceType) => {
        if (url.startsWith('http://api.mapbox.com') || url.startsWith('http://tiles.mapbox.com')) {
          return {
            url: url.replace("?", "?pluginName=dataJoins&")
          }
        }
        return { url };
      }
    });

    const csvUrl =
      "https://raw.githubusercontent.com/hannohiss/Vis-Mapbox-Website/main/housing_sf_other_w_census.csv"
    const csvPromise = papaPromise(csvUrl);

    map.on("load", function () {
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
              incu10:  100 * row["incu10"]  / totalPop,
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
              i7599:   100 * row["i7599"]   / totalPop,
              i100125: 100 * row["i100125"] / totalPop,
              i125150: 100 * row["i125150"] / totalPop,
              i150200: 100 * row["i150200"] / totalPop,
              in200o:  100 * row["in200o"]  / totalPop,
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
        // iterate through the object
        var listedFeatures = [
          "municipal",
          "single_family",
          "percentage_single_family"
        ];
        for (var key in FeatureState) {
          if (!FeatureState.hasOwnProperty(key)) {
            continue;
          }
          if (listedFeatures.includes(key))
            content += "<b>" + key + "</b>" + ": " + FeatureState[key] + "<br>";
        }
        popup.setLngLat(e.lngLat).setHTML(content).addTo(map);
      });

      map.on("mouseleave", "muni-fill", function () {
        map.getCanvas().style.cursor = "";
        popup.remove();
      });



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
      const selectedRangeText = `${incomeLevelTextLow[minIndex]} - ${incomeLevelTextHigh[maxIndex]}`;
      document.getElementById('selectedIncomeRange').textContent = selectedRangeText;
      updateVisualization(minIndex, maxIndex);
    };

    const incomeLevelMin = document.getElementById('incomeLevelMin');
    const incomeLevelMax = document.getElementById('incomeLevelMax');

    if (incomeLevelMin && incomeLevelMax) {
      incomeLevelMin.addEventListener('input', updateIncomeDisplay);
      incomeLevelMax.addEventListener('input', updateIncomeDisplay);
    }
    

    return () => {
      if (incomeLevelMin && incomeLevelMax) {
        incomeLevelMin.removeEventListener('input', updateIncomeDisplay);
        incomeLevelMax.removeEventListener('input', updateIncomeDisplay);
        map.remove();
      }
    };

  }, []);

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

  return (
    <div>
      <div style={{ position: 'absolute', top: 50, right: 10, zIndex: 10000, backgroundColor: 'aliceblue' }}>
        <div>
          Selected Income Range: <span id="selectedIncomeRange"></span>
          <br />
          <input type="range" id="incomeLevelMin" min="0" max="15" value={minIndex} onChange={handleMinChange} step="1" style={{ width: 200 }} />
          <input type="range" id="incomeLevelMax" min="0" max="15" value={maxIndex} onChange={handleMaxChange} step="1" style={{ width: 200 }} />
        </div>
      </div>
      <div id="map" style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }}></div>
    </div>
  );
};

export default IncomeVsSingleFamilyMapComponent;
