import { Text, Image, useScroll } from "@react-three/drei";
import { extend } from '@react-three/fiber'
import { useEffect, useRef, useState } from "react";
import { MeshBasicMaterial, PlaneGeometry, TextureLoader } from "three";
import { fadeOnBeforeCompileFlat } from "../utils/fadeMaterial";
import gsap from "gsap";
import { useFrame, useLoader } from "@react-three/fiber";



export const TextSection = ({ header, title, subtitle, caption, conclusion, image, scale, imagePosition, ...props }) => {
    const [imageAspect, setImageAspect] = useState(1);

    const scrollData = useScroll();
    const textRef = useRef();

    let texture;
    if (image) {
        texture = useLoader(TextureLoader, image);
    }

    // useFrame(() => {

    //     if (scrollData.scroll.current == 0.45) {
    //         gsap.to(textRef.current.material, { opacity: 0, duration: 0.5, ease: 'power2.inOut' });
    //         console.log("animate")
    //     } else if (scrollData.scroll.current > 0.785 && scrollData.scroll.current < 0.825) {

    //     } else if (scrollData.scroll.current > 0.87 && scrollData.scroll.current < 0.92) {

    //     } else if (scrollData.scroll.current > 0.98 && scrollData.scroll.current < 1.0) {

    //     } else {

    //     }

    // })





    return (
        <group {...props} >
            <Text
                color="white"
                anchorX={"left"}
                anchorY="top"
                fontSize={0.2}
                maxWidth={2.5}
                position={[0, 1.6, 0]}
                fillOpacity={1}
            // font={"./fonts/Inter-Regular.ttf"}
            >
                {header}
                <meshStandardMaterial
                    color={"white"}
                    onBeforeCompile={fadeOnBeforeCompileFlat}
                />
            </Text>
            {!!title && (
                <Text
                    color="white"
                    anchorX={"left"}
                    anchorY="bottom"
                    fontSize={0.52}
                    maxWidth={5}
                    lineHeight={1.2}
                    fillOpacity={1}

                // font={"./fonts/DMSerifDisplay-Regular.ttf"}
                >
                    {title}
                    <meshStandardMaterial
                        color={"white"}
                        onBeforeCompile={fadeOnBeforeCompileFlat}
                    />
                </Text>
            )}

            <Text
                ref={textRef}
                color="white"
                anchorX={"left"}
                anchorY="top"
                fontSize={0.2}
                maxWidth={3}
                fillOpacity={1}

            // font={"./fonts/Inter-Regular.ttf"}
            >
                {subtitle}
                <meshStandardMaterial
                    color={"white"}
                    onBeforeCompile={fadeOnBeforeCompileFlat}
                />
            </Text>
            <Text

                color="white"
                anchorX={"left"}
                anchorY="bottom"
                fontSize={0.15}
                maxWidth={2.5}
                position={[0, -0.8, 0]}
                fillOpacity={1}

            // font={"./fonts/Inter-Regular.ttf"}
            >
                {caption}
                <meshStandardMaterial
                    color={"white"}
                    onBeforeCompile={fadeOnBeforeCompileFlat}
                />
            </Text>
            <Text

                color="white"
                anchorX={"left"}
                anchorY="top"
                fontSize={0.2}
                maxWidth={6.5}
                position={[0, -0.8, 0]}
                fillOpacity={1}

            // font={"./fonts/Inter-Regular.ttf"}
            >
                {conclusion}
                <meshStandardMaterial
                    color={"white"}
                    onBeforeCompile={fadeOnBeforeCompileFlat}
                />
            </Text>
            {image && texture && (
                <mesh position={imagePosition} scale={scale}
                >
                    <planeGeometry args={[1, 1.2, 1]} />
                    <meshStandardMaterial transparent onBeforeCompile={fadeOnBeforeCompileFlat} opacity={1}>
                        <primitive attach="map" object={texture} />
                    </meshStandardMaterial>
                </mesh>
            )}
        </group >
    );
};