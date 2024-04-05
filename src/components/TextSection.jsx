import { Text, Image } from "@react-three/drei";
import { extend } from '@react-three/fiber'
import { useEffect, useRef, useState } from "react";
import { fadeOnBeforeCompileFlat } from "../utils/fadeMaterial";
import gsap from "gsap";
import { useFrame } from "@react-three/fiber";



export const TextSection = ({ header, title, subtitle, caption, image, imagePosition, ...props }) => {

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
                maxWidth={2.5}
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
            {image && (
                <Image
                    url={image}
                    transparent
                    scale={[2, 2, 2]}
                    position={[-0.7, -1.1, -0.2]}
                    fragmentShader={fadeOnBeforeCompileFlat}
                >
                </Image>


            )}
        </group >
    );
};