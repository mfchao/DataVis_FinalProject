import { Text, Image } from "@react-three/drei";
import { extend } from '@react-three/fiber'
import { useEffect, useRef, useState } from "react";
import { MeshBasicMaterial, PlaneGeometry, TextureLoader } from "three";
import { fadeOnBeforeCompileFlat } from "../utils/fadeMaterial";
import gsap from "gsap";
import { useFrame, useLoader } from "@react-three/fiber";



export const TextSection = ({ header, title, subtitle, caption, conclusion, image, scale, imagePosition, ...props }) => {
    const [imageAspect, setImageAspect] = useState(1);
    let texture;
    if (image) {
        texture = useLoader(TextureLoader, image);
    }



    return (
        <group {...props}>
            <Text
                color="white"
                anchorX={"left"}
                anchorY="top"
                fontSize={0.2}
                maxWidth={2.5}
                position={[0, 1.6, 0]}
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
                color="white"
                anchorX={"left"}
                anchorY="top"
                fontSize={0.2}
                maxWidth={3}
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
            // font={"./fonts/Inter-Regular.ttf"}
            >
                {conclusion}
                <meshStandardMaterial
                    color={"white"}
                    onBeforeCompile={fadeOnBeforeCompileFlat}
                />
            </Text>
            {image && texture && (
                <mesh position={imagePosition} scale={scale} >
                    <planeGeometry args={[1, 1.2, 1]} />
                    <meshStandardMaterial transparent onBeforeCompile={fadeOnBeforeCompileFlat}>
                        <primitive attach="map" object={texture} />
                    </meshStandardMaterial>
                </mesh>
            )}
        </group >
    );
};