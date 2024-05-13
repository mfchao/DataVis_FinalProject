import { Html, useScroll } from "@react-three/drei";
import { MapManager } from "./MapManager";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react';



export const HtmlWrapper = (props) => {
    const { currentSection, mapOpened, setMapOpened, openMap, setOpenMap, cameraPos, setOpenStats, openStats } = props;

    const scrollData = useScroll();
    const htmlRef = useRef();

    const { camera } = useThree();

    const [clonedPosition, setclonedPosition] = useState(null);

    const [isClosing, setIsClosing] = useState(false);
    const [scrollValue, setScrollValue] = useState(0);




    useEffect(() => {

        if (htmlRef.current) {
            if (mapOpened) {
                gsap.to(htmlRef.current, { opacity: 1, duration: 1, ease: 'power2.inOut' });
            }
        }
    }, [openMap]);

    useEffect(() => {
        if (htmlRef.current) {
            if (isClosing) {
                gsap.to(htmlRef.current, { opacity: 0, duration: 1, ease: 'power2.inOut', onComplete: () => setMapOpened(false) });
            }
        }
    }, [isClosing])

    useFrame(() => {
        if (!openStats) {
            console.log("scroll")
            // console.log(scrollData.scroll.current)
            if (scrollData.scroll.current > 0.51 && scrollData.scroll.current < 0.55) {
                setMapOpened(true);
                setOpenMap('holc');
            } else if (scrollData.scroll.current > 0.785 && scrollData.scroll.current < 0.825) {
                setMapOpened(true);
                setOpenMap('race');
            } else if (scrollData.scroll.current > 0.87 && scrollData.scroll.current < 0.92) {
                setMapOpened(true);
                setOpenMap('income');
            } else if (scrollData.scroll.current > 0.98 && scrollData.scroll.current < 1.0) {
                setMapOpened(true);
                setOpenMap('coi');
            } else {
                if (mapOpened) {
                    setIsClosing(true);

                } else {
                    setIsClosing(false);
                    setOpenMap(null);
                    setMapOpened(false)
                }
            }
        }



        setScrollValue(scrollData.scroll.current);

    })



    // if (!mapOpened) {
    //     return null;
    // }

    return (
        <>
            <mesh>
                <Html ref={htmlRef} className="overflow-y-auto" occlude center onOcclude={setMapOpened} portal={{ current: scrollData.fixed }}
                    style={{
                        transition: 'all 0.5s',
                        width: '100vw',
                        height: '100vh',
                        position: 'fixed !important',
                        opacity: 0
                    }}>
                    <div
                    // onPointerDown={(e) => e.stopPropagation()}
                    >
                        <MapManager currentSection={currentSection} setMapOpened={setMapOpened} openMap={openMap} setOpenMap={setOpenMap} scroll={scrollValue} setOpenStats={setOpenStats}
                            openStats={openStats} />
                    </div>
                </Html>
            </mesh>
        </>
    );
}