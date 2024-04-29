import { Html, useScroll } from "@react-three/drei";
import { MapManager } from "./MapManager";

export const HtmlWrapper = (props) => {
    const { currentSection, mapOpened, setMapOpened, openMap, setOpenMap } = props;

    const scrollData = useScroll();

    if (!mapOpened) {
        return null;
    }

    return (
        <>
            <mesh>
                <Html className="overflow-y-auto" occlude center onOcclude={setMapOpened} portal={{ current: scrollData.fixed }}
                    style={{
                        transition: 'all 0.5s',
                        width: '100vw',
                        height: '100vh',
                        position: 'fixed !important',
                    }}>
                    <div
                    // onPointerDown={(e) => e.stopPropagation()}
                    >
                        <MapManager currentSection={currentSection} setMapOpened={setMapOpened} openMap={openMap} setOpenMap={setOpenMap} />
                    </div>
                </Html>
            </mesh>
        </>
    );
}