import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import Papa from 'papaparse';
import 'mapbox-gl/dist/mapbox-gl.css';


mapboxgl.accessToken = "pk.eyJ1Ijoic2VsaW5kdXJzdW5uIiwiYSI6ImNsdmpucnN6YjFrYWYycm41cGxrNjNsNDMifQ.8ZNsKjRpCDRNEjV5AI4wRg";

const scenes = [
  {
    name: "Scene 1",
    content: "The non-white population gets trapped in the city center.",
    additionalInfo: "Decades after the end of redlining, it is clear that the deliberate racial separation of the past has been maintained geographically, with single family zoning continuing to place barriers to prevent economic mobility for minorities.",
    zoom: 9.499999999999998,
    center: [-70.94930477840957, 42.48069048320767],
    bearing: -60.80000000000007,
    pitch: 67.99999999999987,
    clickable: false
  },
  {
    name: "Scene 2",
    content: "The overflowing population is forced to move to the suburbs.",
    additionalInfo: "The suburbs however are predominantly single-family zoned, making it difficult for non-white residents to move there.",
    zoom: 9.857428010993623,
    center: [-71.13856498878486, 42.38619457149531],
    bearing: -11.400000000001455,
    pitch: 46.00000000000006,
    // zoom: 9.932585283036186,
    // center: [-71.1919093544517, 42.31710718816527],
    // bearing: 0,
    // pitch: 65.543216182992104,
    clickable: false
  },
  {
    name: "Scene 3",
    content: "Single-family zones represent a wall against racial diversity.",
    additionalInfo: "The demographic data shows, how the predominantly white single family housing municipalities are not accessible for people of other race.",

    zoom: 10,
    center: [-71.16277247227424, 42.321083406448],
    bearing: 70,
    pitch: 75,
    clickable: false
  }
];


const RaceMapComponent = (props) => {
  const { setOpenMap, setMapOpened, scroll } = props;

  const mapRef = useRef(null);  // Step 1: Create the ref
  let currentSceneIndex = 0;
  const animationRef = useRef(null);
  const [sceneloaded, setSceneLoaded] = useState(false);


  function updateScene() {
    const scene = scenes[currentSceneIndex];
    document.getElementById("municipality-name").innerText = scene.content;
    document.getElementById("additional-info").innerHTML = scene.additionalInfo;
    document.getElementById("next-scene").style.visibility = currentSceneIndex < scenes.length - 1 ? "visible" : "hidden";
    document.getElementById("previous-scene").style.visibility = currentSceneIndex > 0 ? "visible" : "hidden";
    // if (!scene.clickable) {
    //   disableMapClick();
    // } else {
    //   enableMapClick();
    // }
    zoomToScene(scene);
  }

  function updateScrollScene(index) {
    if (sceneloaded) {
      console.log("zoom")
      const scene = scenes[index];
      zoomToScene(scene);
      setSceneLoaded(false)
    }
  }

  useEffect(() => {
    const updateScene = () => {
      console.log(scroll)
      if (scroll > 0.785 && scroll < 0.8) {
        setSceneLoaded(true)
        updateScrollScene(0)
      } else if (scroll > 0.8 && scroll < 0.815) {
        setSceneLoaded(true)
        updateScrollScene(1)
      } else if (scroll > 0.815 && scroll < 0.825) {
        setSceneLoaded(true)
        updateScrollScene(2)
      }
      animationRef.current = requestAnimationFrame(updateScene);
    };
    animationRef.current = requestAnimationFrame(updateScene);


    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [scroll]);


  function goToNextScene() {
    if (currentSceneIndex < scenes.length - 1) {
      currentSceneIndex++;
      updateScene();
    }
  }

  function goToPreviousScene() {
    if (currentSceneIndex > 0) {
      currentSceneIndex--;
      updateScene();
    }
  }

  function zoomToScene(scene) {
    console.log("Map: ", mapRef.current);
    if (mapRef.current) {  // Check if the map instance is available
      mapRef.current.flyTo({  // Step 3: Use the ref to access the map instance
        center: scene.center,
        zoom: scene.zoom,
        bearing: scene.bearing,
        pitch: scene.pitch,
        essential: true,
        speed: 0.3
      });
    }
  }

  // function handleClick(e) {
  //   const bbox = [
  //     [e.point.x - 5, e.point.y - 5],
  //     [e.point.x + 5, e.point.y + 5]
  //   ];
  //   const selectedFeatures = map.queryRenderedFeatures(bbox, {
  //     layers: ["municipalities-layer"]
  //   });
  //   if (selectedFeatures.length > 0) {
  //     const municipalityName = selectedFeatures[0].properties.municipal;
  //     document.getElementById("municipality-name").innerText = `Municipality: ${municipalityName}`;
  //     highlightedMunicipality = selectedFeatures[0].properties.muni_id;
  //   } else {
  //     console.warn("No features found at click point:", e.point);
  //   }
  // }


  const mapOpacity = .5;

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/selindursunn/clvmvhh2z045m01pefzng2rzp',
      zoom: scenes[currentSceneIndex].zoom,
      center: scenes[currentSceneIndex].center,
      bearing: scenes[currentSceneIndex].bearing,
      pitch: scenes[currentSceneIndex].pitch,
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

    mapRef.current = map;  // Step 2: Assign the ref to the map

    const csvUrl = "https://raw.githubusercontent.com/mfchao/DataVis_FinalProject/main/src/data/sfh_w_coi.csv";
    const csvPromise = papaPromise(csvUrl);

    map.on("load", function () {
      csvPromise.then(function (results) {
        console.log(results.data);
        results.data.forEach((row) => {

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
              percentage_nhwhite: Math.round(row["nhwhi"] / row["pop"] * 10000) / 100,
              percentage_non_white: Math.round((1 - row["nhwhi"] / row["pop"]) * 10000) / 100,
              absolute_non_white: Math.max(0, row["pop"] - row["nhwhi"]),
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
            // ['feature-state', 'absolute_non_white'],
            // 10, 0,
            // 50000, 5000
            ['feature-state', 'percentage_non_white'],
            10, 0,
            100, 10000
          ],
          'fill-extrusion-base': 0, // Base of the extrusions
          'fill-extrusion-opacity': 1, // Adjust the opacity as needed
          // Maintain the color from the existing layer
          'fill-extrusion-color': [
            'interpolate',
            ['linear'],
            ['feature-state', 'single_family'],
            0, '#39607d', // Start color for 0%
            100, '#752f2f'  // End color for 100%
          ]
        }
      });

      map.setLight({
        'anchor': 'map',
        'color': 'white',
        'intensity': 100,
        'position': [45, 180, 80]
      });

      // map.addLayer({
      //   id: "mass-muni-line",
      //   type: "line",
      //   source: "mass-muni",
      //   "source-layer": "ma_municipalities_degrees-8uvqwo",
      //   layout: {
      //     "line-join": "round",
      //     "line-cap": "round",
      //   },
      //   paint: {
      //     "line-color": "#D8CAC1",
      //     "line-width": .5,
      //   },
      // });

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
        content += "<div style='user-select: none; pointer-events: none;'>";
        content += "<b>" + FeatureState["municipal"] + "</b>" + "<br>";
        content += "<b>" + Math.round(FeatureState["percentage_non_white"]) + "% </b>" + "Non-White Residents" + "<br>";
        content += "</div>";
        // for (var key in FeatureState) {
        //   if (key !== "municipal" && key !== "white") {
        //     content += "<b>" + key + ": " + FeatureState[key] + "%</b>" + "<br>";
        //   }
        // }
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
        console.log(`zoom: ${zoom},\ncenter: [${center.lng}, ${center.lat}],\nbearing: ${bearing},\npitch: ${pitch},`);
      });



    });

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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'absolute',
        top: '20px', right: '20px', height: '90%', width: '30%', backgroundColor: 'rgba(1, 0, 21, 0.75)', padding: '20px',
        boxSizing: 'border-box', borderRadius: '10px', fontStyle: 'Poppins', fontSize: '12px', color: 'rgb(218, 218, 218)'
      }}>
        <div id="municipality-name" style={{ fontSize: '30px', fontWeight: 'bold', color: 'white', padding: '0px', marginBottom: '20px' }}>Single-family zoned municipalities have disproportionately whiter populations.</div>
        <div id="additional-info" style={{ fontSize: '20px' }}>
          Decades after the end of redlining, it is clear that the deliberate racial separation of the past has been maintained geographically, with single family zoning continuing to place barriers to prevent economic mobility for minorities.
        </div>
        <h2 style={{ fontSize: '15px', marginTop: '20px' }}>Keep Scrolling to explore more!</h2>
        <div style={{ marginTop: 'auto' }}>
          <div id="legend" style={{ padding: '30px' }}>
            <div>
              <p style={{ fontSize: '15px', marginBottom: '20px' }}>
                <b>Height</b> represents % population of non-Hispanic White residents.
              </p>
              <p style={{ fontSize: '15px', marginTop: '20px' }}>
                <ul>
                  <li><b>Blue</b> = No single-family Housing</li>
                  <li><b>Red</b> = single-family Housing</li>
                </ul>
              </p>
            </div>
          </div>
          <div id="navigation" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button id="previous-scene" onClick={goToPreviousScene} style={{ visibility: 'hidden' }}>

              <img src="../images/left-arrow.png" alt="Previous" style={{ width: '40px', height: '40px' }} />
            </button>
            <button id="next-scene" onClick={goToNextScene} style={{ visibility: 'visible' }}>
              <img src="../images/right-arrow.png" alt="Next" style={{ width: '40px', height: '40px' }} />

            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaceMapComponent;
