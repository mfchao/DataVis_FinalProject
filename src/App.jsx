import { Canvas } from "@react-three/fiber";
import { Timeline } from "./components/Timeline";

function App() {
  return (
    <>
      <Canvas camera={{
        position: [0, 0, 5],
        fov: 30,
      }}>
        <color attach="background" args={["#ececec"]} />
        <Timeline />
      </Canvas>
    </>
  );
}

export default App;
