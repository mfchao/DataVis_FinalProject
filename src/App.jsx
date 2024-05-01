import { Canvas } from "@react-three/fiber";
import { Timeline } from "./components/Timeline";
import { SheetProvider } from '@theatre/r3f'
import { OrbitControls, ScrollControls } from "@react-three/drei";
import React, { useEffect, useState, useRef } from 'react';
import { getProject, val, types } from '@theatre/core';
import { ScrollManager } from './components/ScrollManager';
import MapComponent from './components/IncomeVsSingleFamilyMapComponent'
import HolcMapComponent from './components/HolcMapComponent'
import CoiVsSingleFamilyMapComponent from "./components/CoiVsSingleFamilyMapComponent";
import IncomeVsSingleFamilyMapComponent from "./components/IncomeVsSingleFamilyMapComponent";
import { Menu } from './components/Menu';
import { EffectComposer, Noise } from '@react-three/postprocessing';
import { HtmlWrapper } from './components/HtmlWrapper';
import Statistics from './components/Statistics';

function App() {
  // const sheet = getProject("Fly Through 1").sheet("Scene")
  const [section, setSection] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);

  const [mapOpened, setMapOpened] = useState(false);
  const [openMap, setOpenMap] = useState(null);



  return (
    <>
      {/* <div style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%' }}>
        <div style={{ width: '40%' }}> */}
      <Canvas shadows>
        <color attach="background" args={["#ececec"]} />

        <ScrollControls pages={10} damping={0.5} enabled={mapOpened ? false : true}>
          <ScrollManager section={section} onSectionChange={setSection} />

          <HtmlWrapper
            currentSection={currentSection}
            mapOpened={mapOpened}
            setMapOpened={setMapOpened}
            openMap={openMap}
            setOpenMap={setOpenMap}
          />

          {/* <SheetProvider sheet={sheet}> */}
          <Timeline setCurrentSection={setCurrentSection} setMapOpened={setMapOpened} mapOpened={mapOpened} openMap={openMap} setOpenMap={setOpenMap} />
          {/* </SheetProvider> */}
        </ScrollControls>

        <EffectComposer >
          <Noise opacity={0.1} />
        </EffectComposer>
      </Canvas>
      {/* </div>
         <div style={{ width: '60%' }}>
          <CoiVsSingleFamilyMapComponent/>
        </div> 
      </div> */}

    {currentSection === 10 ? <Statistics /> : null}

      <Menu
        onSectionChange={setSection}
        currentSection={currentSection}
      />

    </>
  );
}

export default App;


