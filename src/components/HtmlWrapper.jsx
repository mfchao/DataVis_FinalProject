import { Html, useScroll } from "@react-three/drei";
import { MapManager } from "./MapManager";
import { useFrame } from "@react-three/fiber";
import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react';



export const HtmlWrapper = (props) => {
    const { currentSection, mapOpened, setMapOpened, openMap, setOpenMap } = props;

    const scrollData = useScroll();
    const htmlRef = useRef();

    const [isClosing, setIsClosing] = useState(false);



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

        // console.log(scrollData.scroll.current)
        if (scrollData.scroll.current > 0.51 && scrollData.scroll.current < 0.55) {
            setMapOpened(true);
            setOpenMap('holc');
        } else if (scrollData.scroll.current > 0.785 && scrollData.scroll.current < 0.81) {
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
                        <MapManager currentSection={currentSection} setMapOpened={setMapOpened} openMap={openMap} setOpenMap={setOpenMap} />
                    </div>
                </Html>
            </mesh>
        </>
    );
}