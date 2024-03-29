import { Canvas } from "@react-three/fiber";
import { Timeline } from "./components/Timeline";
import { SheetProvider } from '@theatre/r3f'
import { ScrollControls } from "@react-three/drei";
import React, { useEffect, useState, useRef } from 'react';
import { getProject, val, types } from '@theatre/core';




function App() {
  // const sheet = getProject("Fly Through 1").sheet("Scene")

  return (
    <>
      <Canvas >
        <ScrollControls pages={9} damping={0.5}>
          {/* <SheetProvider sheet={sheet}> */}
          <Timeline />
          {/* </SheetProvider> */}
        </ScrollControls>


      </Canvas>

    </>
  );
}

export default App;


