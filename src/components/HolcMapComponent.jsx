import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Papa from 'papaparse';
import 'mapbox-gl/dist/mapbox-gl.css';


mapboxgl.accessToken = "pk.eyJ1Ijoic2VsaW5kdXJzdW5uIiwiYSI6ImNsdmpucnN6YjFrYWYycm41cGxrNjNsNDMifQ.8ZNsKjRpCDRNEjV5AI4wRg";

const HolcMapComponent = (props) => {
  const { setOpenMap, setMapOpened } = props;
  const [map, setMap] = useState(null);

  const [HolcToSfSlider, setHolcToSfSlider] = useState(0.1);

  useEffect(() => {
    const newMap = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/selindursunn/clvmvhh2z045m01pefzng2rzp',
      zoom: 10.365,
      center: [-71.068, 42.353],
      bearing: 0,
      pitch: 0,
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

    newMap.on("load", function () {
      csvPromise.then(function (results) {
        console.log(results.data);
        results.data.forEach((row) => {

          newMap.setFeatureState(
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
              percentage_single_family: Math.round(row["%_single_family"] * 100) / 100
            }
          );
        });
      });


      // Bottom Map
      newMap.loadImage('https://raw.githubusercontent.com/mfchao/DataVis_FinalProject/main/src/data/MA_Boston_1938.png', function (error, image) {
        if (error) throw error;

        // Add the image as a source to the newMap
        newMap.addSource('bottom-map', {
          type: 'image',
          url: 'https://raw.githubusercontent.com/mfchao/DataVis_FinalProject/main/src/data/MA_Boston_1938.png',
          coordinates: [
            [-71.272, 42.376],  // top left corner of the image
            [-70.9752, 42.375],  // top right corner
            [-70.969, 42.20], // bottom right corner
            [-71.276, 42.201]  // bottom left corner
          ]
        });

        // Add a new layer to display the image
        newMap.addLayer({
          id: 'bottom-map-layer',
          type: 'raster',
          source: 'bottom-map',
          paint: {
            'raster-opacity': 1 - HolcToSfSlider // Adjust the opacity if needed
          }
        });

      });

      // Top Map
      newMap.loadImage('https://raw.githubusercontent.com/mfchao/DataVis_FinalProject/main/src/data/MA_BostonSection2_1938.png', function (error, image) {
        if (error) throw error;

        // Add the image as a source to the newMap
        newMap.addSource('top-map', {
          type: 'image',
          url: 'https://raw.githubusercontent.com/mfchao/DataVis_FinalProject/main/src/data/MA_BostonSection2_1938.png',
          coordinates: [
            [-71.286, 42.4865],  // top left corner of the image
            [-70.9752, 42.486],  // top right corner
            [-70.978, 42.343], // bottom right corner
            [-71.286, 42.34]  // bottom left corner
          ]
        });

        // Add a new layer to display the image
        newMap.addLayer({
          id: 'top-map-layer',
          type: 'raster',
          source: 'top-map',
          paint: {
            'raster-opacity': 1 - HolcToSfSlider // Adjust the opacity if needed
          }
        });

      });


      // YOUR TURN: Add source layer
      newMap.addSource("mass-muni", {
        type: "vector",
        url: "mapbox://hannohiss.890zal4l",
        promoteId: "muni_id",
      });

      newMap.addLayer({
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
            ['feature-state', 'percentage_single_family'],
            0, 100,
            100, 100
          ],
          'fill-extrusion-base': 0, // Base of the extrusions
          'fill-extrusion-opacity': Number(HolcToSfSlider), // Adjust the opacity as needed
          // Maintain the color from the existing layer
          'fill-extrusion-color': [
            'interpolate',
            ['linear'],
            ['feature-state', 'percentage_single_family'],
            0, '#000000', // Start color for 0%
            100, '#FFFFFF'  // End color for 100%
          ]
        }
      });


      newMap.addLayer({
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
          "line-width": .5,
        },
      });



      var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      newMap.on("mousemove", "mass-muni-extrusion", function (e) {
        newMap.getCanvas().style.cursor = "pointer";

        var muni = newMap.queryRenderedFeatures(e.point, {
          layers: ["mass-muni-extrusion"],
        });

        var FeatureState = muni[0].state; // Feature state
        var content = "";
        content += "<b>" + FeatureState["municipal"] + "</b>" + "<br>";
        content += "<b>" + Math.round(FeatureState["percentage_single_family"]) + "% </b>" + "Single Family Homes" + "<br>";
        popup.setLngLat(e.lngLat).setHTML(content).addTo(newMap);
      });

      newMap.on("mouseleave", "muni-fill", function () {
        newMap.getCanvas().style.cursor = "";
        popup.remove();
      });

      // Event listener to log camera position, zoom level, and bearing
      newMap.on('moveend', () => {
        const center = newMap.getCenter();
        const zoom = newMap.getZoom();
        const bearing = newMap.getBearing();
        const pitch = newMap.getPitch();
        console.log(`Map center: Latitude ${center.lat}, Longitude ${center.lng}`);
        console.log(`Zoom level: ${zoom}`);
        console.log(`Bearing: ${bearing} degrees`);
        console.log(`Pitch: ${pitch} degrees`)
      });

      setMap(newMap)

      const updateDisplay = (event) => {
        setHolcToSfSlider(event.target.value);
      };

      const HolcToSfSliderElement = document.getElementById('HolcToSf');
      HolcToSfSliderElement.addEventListener('input', updateDisplay);



    });

  }, []);

  useEffect(() => {
    if (!map) return;
    try {
      var sliderValue = Number(HolcToSfSlider);
      console.log("!!!", sliderValue);
      map.setPaintProperty('bottom-map-layer', 'raster-opacity', 1 - sliderValue);
      map.setPaintProperty('top-map-layer', 'raster-opacity', 1 - sliderValue);
      map.setPaintProperty('mass-muni-extrusion', 'fill-extrusion-opacity', sliderValue);
    } catch (error) {
      console.error('Failed to set paint property:', error);
    }

  }, [HolcToSfSlider])


  const papaPromise = (url) => new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: resolve,
      error: reject
    });
  });

  const handleClick = () => {
    setOpenMap(null);
    setMapOpened(false);
    // setArchiveMapId(null);
  };

  return (
    <div>
      <button style={{ position: 'absolute', top: 50, left: 20, zIndex: 11000, color: 'aliceblue' }}
        onClick={handleClick}>
        BACK
      </button>
      <div id="map" style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }}></div>
      <div id="info-bar" style={{
        position: 'absolute',
        top: '20px', right: '20px', height: '90%', width: '35%', backgroundColor: 'rgba(1, 0, 21, 0.75)', padding: '20px',
        boxSizing: 'border-box', borderRadius: '10px', fontStyle: 'Poppins', fontSize: '14px', color: 'rgb(218, 218, 218)'
      }}>
        <div id="municipality-name" style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', padding: '0px', marginBottom: '20px' }}>Correlation of areas zoned for single family housing with historical redlining practices.</div>
        <div id="additional-info" style={{}}>
          The Home Owners Loan Corporation used 4 grades for their Residential Security maps, using green for "Best", blue for "Still Desirable", yellow for "Definitely Declining," and red for "Hazardous".
          The area descriptions used when producing these grades focused not on crime statistics or environmental concerns, but on assessments of the residents themselves often on the basis of race, class, religion and nationality.
          One redlined area in Roxbury was identified as "25% negro" and stated "Negro heavily concentrated north of Ruggles St.". A yellow neighborhood in Cambridge stated "A few negro families have moved in on Dame St. and threaten to spread."
          <br /> <br/>
          Adjust the slider to see how the single-family zoning maps correspond to the HOLC redlining maps.
        </div>
        <br/>
        <input type="range" id="HolcToSf" min="0" max="1" value={HolcToSfSlider} step=".01" style={{ width: 200 }} />
        <div id="legend" style={{ padding: '10px', backgroundColor: 'rgba(1, 0, 21, 0.75)' }}>
          <h4 style={{ fontSize: 'larger' }}>
            Legend:
          </h4>
          <div
            class="image-container"
            style={{
              display: 'flex',
              width: '35%',
              padding: '30px',
            }}
          >
            <h5>100% Single Family Housing</h5>
            <img
              src="src/data/SFH.png"
              alt="Single Family Housing"
              style={{
                flex: 1,
                width: '50%',
                height: 'auto',
                margin: '5px'
              }}
            />
            <h5>0% Single Family Housing</h5>
            <img
              src="src/data/NSFH.png"
              alt="No Single Family Housing"
              style={{
                flex: 1,
                width: '50%',
                height: 'auto',
                margin: '5px'
              }}
            />
          </div>

          <div>
            <p>
              {/* White overlay displays percentage of housing zoned for only single-family residences as opacity. <br />
              no overlay = 0% single family housing <br />
              completely opaque = 100% single family housing */}
              Maps are geo-corrected scans of original HOLC redlining maps.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolcMapComponent;
