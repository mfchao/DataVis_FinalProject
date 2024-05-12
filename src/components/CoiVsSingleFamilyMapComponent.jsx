import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Papa from 'papaparse';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = "pk.eyJ1Ijoic2VsaW5kdXJzdW5uIiwiYSI6ImNsdmpucnN6YjFrYWYycm41cGxrNjNsNDMifQ.8ZNsKjRpCDRNEjV5AI4wRg";

const CoiVsSingleFamilyMapComponent = (props) => {
  const { setOpenMap, setMapOpened } = props;

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/selindursunn/clvjpb4wz069501pkdvkhb2i7',
      zoom: 9.61,
      center: [-71.0913, 42.4047],
      bearing: -83,
      pitch: 55,
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

    const csvUrl = "https://raw.githubusercontent.com/mfchao/DataVis_FinalProject/main/src/data/sfh_w_coi.csv";
    const csvPromise = papaPromise(csvUrl);

    map.on("load", function () {
      csvPromise.then(function (results) {
        results.data.forEach((row) => {
          map.setFeatureState(
            {
              source: "mass-muni",
              sourceLayer: "ma_municipalities_degrees-8uvqwo",
              id: row.muni_id,
            },
            {
              municipal: row.muni,
              single_family: row.only_single_family * 100,
              percentage_single_family: Math.round(row["%_single_family"] * 100) / 100,
              coi_score: Math.round(row["COI Score"] * 100) / 100
            }
          );
        });
      });

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
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['feature-state', 'coi_score'],
            1, 0,
            9.5, 5000
          ],
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.1,
          'fill-extrusion-color': [
            'interpolate',
            ['linear'],
            ['feature-state', 'percentage_single_family'],
            0, '#6BA0C7',
            100, '#CE575E'
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

        var FeatureState = muni[0].state;
        var content = "";
        content += "<b>" + FeatureState["municipal"] + "</b>" + "<br>";
        content += "<b>" + Math.round(FeatureState["coi_score"]) + "</b>" + " COI (Child Opportunity Index)" + "<br>";
        popup.setLngLat(e.lngLat).setHTML(content).addTo(map);
      });

      map.on("mouseleave", "mass-muni-extrusion", function () {
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

    return () => {
      map.remove();
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

  const handleClick = () => {
    setOpenMap(null);
    setMapOpened(false);
  };

  return (
    <div>
      <button style={{ position: 'absolute', top: 50, left: 20, zIndex: 11000, color: 'aliceblue' }} onClick={handleClick}>BACK</button>
      <div id="map" style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }}></div>
      <div id="info-bar" style={{ position: 'absolute', top: '20px', right: '20px', height: '90%', width: '30%', backgroundColor: 'rgba(1, 0, 21, 0.75)', padding: '20px', boxSizing: 'border-box', borderRadius: '10px', fontStyle: 'Poppins', fontSize: '12px', color: 'rgb(218, 218, 218)' }}>
        <div id="municipality-name" style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', padding: '0px', marginBottom: '20px' }}>Staggering income disparities between municipalities across the Boston Metropolitan Area.</div>
        <div id="additional-info" style={{}}>
          In 2018 - 2022 , the median value of an owner-occupied home was $684,900 and median gross rent $1,981, while the median income in the same timeframe was $89,212. In 1960, 8 years before the 1968 Fair Housing Act outlawed redlining, the median price of an owner-occupied house was $15,900 and median gross rent was $82 dollars. The median regional income for white families at that time was $5,835 while for nonwhite families it was $3,233.
          <br />
          Those who had the upper hand in property ownership in the 1960s have accumulated a massive amount of wealth through no more than land ownership. The inability to increase housing in these regions through single-family zoning has artificially created a limited supply for a very real growing demand for housing, creating a nearly impassible financial barrier to mobility that replaced that which was established with historical redlining.
          <br />
          Default position of $0 - $75,000 annual household income represents a range entirely below the median value of $89,212.
        </div>
        <div id="legend" style={{ padding: '30px' }}>
          <h4 style={{ fontSize: 'larger' }}>Legend:</h4>
          <div>
            <svg width="20" height="20" className="glow1">
              <circle cx="10" cy="10" r="8" style={{ fill: '#FF69B4' }}></circle>
            </svg>
            <span>Poor Education Quality (Niche Grades) </span>
          </div>
          <div>
            <svg width="20" height="20" className="glow2">
              <circle cx="10" cy="10" r="8" style={{ fill: '#0048FF' }}></circle>
            </svg>
            <span>Good Education Quality</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoiVsSingleFamilyMapComponent;
