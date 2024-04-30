import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Papa from 'papaparse';
import 'mapbox-gl/dist/mapbox-gl.css';


mapboxgl.accessToken = "pk.eyJ1Ijoic2VsaW5kdXJzdW5uIiwiYSI6ImNsdmpucnN6YjFrYWYycm41cGxrNjNsNDMifQ.8ZNsKjRpCDRNEjV5AI4wRg";

const HolcMapComponent = (props) => {
  const { setOpenMap, setMapOpened } = props;

  const mapOpacity = .5;

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/selindursunn/clvmvhh2z045m01pefzng2rzp',
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

    const csvUrl =
      "https://raw.githubusercontent.com/hannohiss/Vis-Mapbox-Website/main/housing_sf_other_w_census.csv"
    const csvPromise = papaPromise(csvUrl);

    map.on("load", function () {
      csvPromise.then(function (results) {
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
              percentage_single_family: Math.round(row["%_single_family"] * 100) / 100
            }
          );
        });
      });


      // Bottom Map
      map.loadImage('src/data/MA_Boston_1938.png', function (error, image) {
        if (error) throw error;

        // Add the image as a source to the map
        map.addSource('bottom-map', {
          type: 'image',
          url: 'src/data/MA_Boston_1938.png',
          coordinates: [
            [-71.272, 42.376],  // top left corner of the image
            [-70.9752, 42.375],  // top right corner
            [-70.969, 42.20], // bottom right corner
            [-71.276, 42.201]  // bottom left corner
          ]
        });

        // Add a new layer to display the image
        map.addLayer({
          id: 'bottom-map-layer',
          type: 'raster',
          source: 'bottom-map',
          paint: {
            'raster-opacity': mapOpacity // Adjust the opacity if needed
          }
        });

      });

      // Top Map
      map.loadImage('src/data/MA_BostonSection2_1938.png', function (error, image) {
        if (error) throw error;

        // Add the image as a source to the map
        map.addSource('top-map', {
          type: 'image',
          url: 'src/data/MA_BostonSection2_1938.png',
          coordinates: [
            [-71.286, 42.4865],  // top left corner of the image
            [-70.9752, 42.486],  // top right corner
            [-70.978, 42.343], // bottom right corner
            [-71.286, 42.34]  // bottom left corner
          ]
        });

        // Add a new layer to display the image
        map.addLayer({
          id: 'top-map-layer',
          type: 'raster',
          source: 'top-map',
          paint: {
            'raster-opacity': mapOpacity // Adjust the opacity if needed
          }
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
            ['feature-state', 'percentage_single_family'],
            0, 100,
            100, 100
          ],
          'fill-extrusion-base': 0, // Base of the extrusions
          'fill-extrusion-opacity': 1, // Adjust the opacity as needed
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
          "line-width": .5,
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
        position: 'absolute',
        top: '20px', right: '20px', height: '90%', width: '30%', backgroundColor: 'rgba(1, 0, 21, 0.75)', padding: '20px',
        boxSizing: 'border-box', borderRadius: '10px', fontStyle: 'Poppins', fontSize: '12px', color: 'rgb(218, 218, 218)'
      }}>
        <div id="municipality-name" style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', padding: '0px', marginBottom: '20px' }}>Correlation of areas zoned for single family housing with historical redlining practices.</div>
        <div id="additional-info" style={{}}>
          The Home Owners Loan Corporation used 4 grades for their Residential Security maps, using green for "Best", blue for "Still Desirable", yellow for "Definitely Declining," and red for "Hazardous".
          The area descriptions used when producing these grades focused not on crime statistics or environmental concerns, but on assessments of the residents themselves often on the basis of race, class, religion and nationality.
          One redlined area in Roxbury was identified as "25% negro" and stated "Negro heavily concentrated north of Ruggles St.". A yellow neighborhood in Cambridge stated "A few negro families have moved in on Dame St. and threaten to spread."
        </div>
        <div id="legend" style={{ padding: '30px' }}>
          <h4 style={{ fontSize: 'larger' }}>
            Legend:
          </h4>
          <div>
            <p>
              White overlay displays percentage of housing zoned for only single-family residences as opacity. <br />
              no overlay = 0% single family housing <br />
              completely opaque = 100% single family housing
              <br /> <br />
              Maps are geo-corrected scans of original HOLC redlining maps.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolcMapComponent;
