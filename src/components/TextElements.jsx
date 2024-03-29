import { editable as e } from "@theatre/r3f";
import React, { useEffect, useMemo, useState, useRef, useCallback, memo, useContext } from "react";
import { getProject, val, types } from "@theatre/core";
import fonts from "../assets/fonts";
import { Text, useCursor } from "@react-three/drei";




export const TextElements = () => {


    const [styles, setStyles] = useState({
        maxWidth: 300,
        lineHeight: 1,
        textAlign: "center",
        materialType: "MeshStandardMaterial",
        moveNumber: 0,
    });

    const [title, setTitle] = useState({
        fontSize: 0.1,
        letterSpacing: 0.05,
        font: fonts.SFCompactSemibold,
        moveNumber: 0,
    });

    const [bold, setBold] = useState({
        fontSize: 0.1,
        letterSpacing: 0.05,
        font: fonts.SFCompactBold,
        moveNumber: 0,
    });

    const [subtitle, setSubtitle] = useState({
        fontSize: 0.07,
        letterSpacing: 0.05,
        font: fonts.SFCompactLight,
        moveNumber: 0,
    });

    const [body, setBody] = useState({
        fontSize: 0.06,
        font: fonts.SFCompactLight,
        moveNumber: 0,
    });




    const textElements = [
        {
            key: "P0Text1",
            text: "Welcome to the",
            fillOpacityState: useState(null),
            visible: useState(false),
            ref: useRef(),
            color: "black",
            toggleProject: false,
            props: subtitle,
            clickable: useState(false),
        },
        {
            key: "P0Text2",
            text: " Timeline of Exclusionary Zoning",
            fillOpacityState: useState(null),
            visible: useState(false),
            ref: useRef(),
            color: "black",
            toggleProject: false,
            props: title,
            clickable: useState(false),
        },
        ,
        {
            key: "P0Text3",
            text: " scroll to begin",
            fillOpacityState: useState(null),
            visible: useState(false),
            ref: useRef(),
            color: "black",
            toggleProject: false,
            props: body,
            clickable: useState(false),
        },


    ];



    useEffect(() => {
        textElements.forEach((element) => {
            const [opacityState, setOpacityState] = element.fillOpacityState;
            const [visible, setVisibleState] = element.visible;


            if (!opacityState) return;

            const unsubscribe = opacityState.onValuesChange((newValues) => {
                element.ref.current.fillOpacity = newValues.fillOpacity;

                if (element.ref.current.fillOpacity > 0.6) {
                    setVisibleState(true);
                } else {
                    setVisibleState(false);
                }
            });
            return unsubscribe;
        });
    }, [textElements]);


    return (
        <>
            {textElements.map((element) => (

                <e.mesh key={element.key} theatreKey={element.key} additionalProps={{ fillOpacity: types.number(1, { nudgeMultiplier: 0.1 }) }} objRef={element.fillOpacityState[1]}>
                    <Text ref={element.ref}
                        text={element.text}
                        position={[0, element.props.moveNumber, 0]}
                        color={element.color}
                        outlineColor={'black'}
                        outlineOpacity={element.outlineOpacity && element.visible[0] ? element.outlineOpacity : 0}
                        outlineWidth={element.outlineWidth ? element.outlineWidth : 0}
                        {...styles} {...element.props}

                    />
                </e.mesh>
            ))}
        </>
    )
}

