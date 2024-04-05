import { Canvas } from "@react-three/fiber";
import { Timeline } from "./components/Timeline";
import { SheetProvider } from '@theatre/r3f'
import { OrbitControls, ScrollControls } from "@react-three/drei";
import React, { useEffect, useState, useRef } from 'react';
import { getProject, val, types } from '@theatre/core';
import { ScrollManager } from './components/ScrollManager';
import { Menu } from './components/Menu';
import { EffectComposer, Noise } from '@react-three/postprocessing';





function App() {
  // const sheet = getProject("Fly Through 1").sheet("Scene")
  const [section, setSection] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);


  return (
    <>
      <Canvas shadows>
        <color attach="background" args={["#ececec"]} />

        <ScrollControls pages={9} damping={0.5}>
          <ScrollManager section={section} onSectionChange={setSection} />

          {/* <SheetProvider sheet={sheet}> */}
          <Timeline setCurrentSection={setCurrentSection} />
          {/* </SheetProvider> */}
        </ScrollControls>

        <EffectComposer >
          <Noise opacity={0.1} />
        </EffectComposer>
      </Canvas>



      <Menu
        onSectionChange={setSection}
        currentSection={currentSection}
      />

    </>
  );
}

export default App;


