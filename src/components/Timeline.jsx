import { Float, PerspectiveCamera, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import { useEffect, useState, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Euler, Group, Vector3 } from "three";
import { usePlay } from "../contexts/Play";
import { fadeOnBeforeCompile } from "../utils/fadeMaterial";
import { TextSection } from "./TextSection";
import { Background } from "./Background";


const LINE_NB_POINTS = 1000;
const CURVE_DISTANCE = 200;
const CURVE_AHEAD_CAMERA = 0.008;

const FRICTION_DISTANCE = 42;
const bgColors = [
  { colorA: "#9A9380", colorB: "#766F5C", colorC: "#e8f2d8", duration: 0.5 },
  { colorA: "#948869", colorB: "#6e654d", colorC: "#CFE0FF", duration: 1 },
  { colorA: "#948869", colorB: "#6e654d", colorC: "#e3f8fa", duration: 1 },
  { colorA: "#232191", colorB: "#080738", colorC: "#7decf5", duration: 1 },
  { colorA: "#302db5", colorB: "#080738", colorC: "#FFFFFF", duration: 1 },
];

export const Timeline = (props) => {
  const { setCurrentSection } = props;

  const curvePoints = useMemo(
    () => [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -CURVE_DISTANCE),
      new THREE.Vector3(100, 0, -2 * CURVE_DISTANCE),
      new THREE.Vector3(-100, 0, -3 * CURVE_DISTANCE),
      new THREE.Vector3(100, 0, -4 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -5 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -6 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -7 * CURVE_DISTANCE),
    ],
    []
  );

  const sceneOpacity = useRef(0);
  const lineMaterialRef = useRef();

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(curvePoints, false, "catmullrom", 0.5);
  }, []);

  const textSections = useMemo(() => {
    return [
      {
        cameraRailDist: 0,
        position: new Vector3(
          curvePoints[0].x - 2.3,
          curvePoints[0].y - 0.4,
          curvePoints[0].z - 10
        ),
        header: "Welcome to the",
        title: "Timeline of Exclusionary Zoning",
        caption: ` Scroll to begin`,
      },
      {
        cameraRailDist: -1,
        position: new Vector3(
          curvePoints[1].x - 7,
          curvePoints[1].y,
          curvePoints[1].z + 22
        ),
        title: "1843",
        subtitle: `First racially restrictive covenant, stating that land not be sold to a "Negro or native of Ireland"`,
        image: '../images/2-men-sepia.png'

      },
      {
        cameraRailDist: 1.5,
        position: new Vector3(
          curvePoints[2].x - 0.5,
          curvePoints[2].y + 0.8,
          curvePoints[2].z + 40
        ),
        rotation: [0, -0.1, 0],
        title: "1927",
        subtitle: `The National Association of Real Estate Boards' Code of Ethics creates covenant stating "no part of the property should be used, occupied, sold or leased to black people, unless they were servants, janitors, or chauffeurs living in basements, servants' quarters, or a barn or garage in the rear."`,
        image: '../images/mom-child-2.png'

      },
      {
        cameraRailDist: -1,
        position: new Vector3(
          curvePoints[3].x + 48,
          curvePoints[3].y + 1,
          curvePoints[3].z + 70
        ),
        rotation: [0, 1, 0],
        title: "1938",
        subtitle: `Home Owners Loan Corporation (HOLC) created Residential Security maps for assessing the risk of financing mortgages. Areas were given 4 grades, from A for "best" to D for "hazardous".`,
        image: '../images/children=4.png'
      },
      {
        cameraRailDist: 1.5,
        position: new Vector3(
          curvePoints[4].x - 96,
          curvePoints[4].y + 0.5,
          curvePoints[4].z + 95
        ),
        rotation: [0, -1, 0],
        title: "1960",
        subtitle: `Median price of owner-occupied housing in Boston is $15,900 and median gross monthly rent is $82 ($984 annualy).`,
        image: '../images/couple-2.png'

      },
      {
        cameraRailDist: 1.5,
        position: new Vector3(
          curvePoints[4].x + 4,
          curvePoints[4].y + 1,
          curvePoints[4].z - 9
        ),
        rotation: [0, 0, 0],
        title: "1968",
        subtitle: `Redlining is outlawed by the U.S. 1968 Fair Housing Act. Boston establishes the Boston Urban Renewal Groud (BBRG) to provide Black Bostonians FHA-insured loans and mortgages, but only in Dorchester, Mattapan, and Roxbury, areas which were 'red' under the just-outlawed HOLC map system.`,
        image: '../images/couple.png'

      },
      {
        cameraRailDist: -0.5,
        position: new Vector3(
          curvePoints[5].x - 11,
          curvePoints[5].y + 1.3,
          curvePoints[5].z - 60
        ),
        rotation: [0, 0, 0],
        title: "2018",
        subtitle: `The impacts of single-family zoning continue to this day. While explicitly segregationist housing policies have gone away, the geographic and economical foundation that they laid has allowed the impacts to carry forward into modern day, largely maintained by exclusionary single-family zoning. `,
        image: '../images/black-child-1.png'

      },

      {
        cameraRailDist: 8,
        position: new Vector3(
          curvePoints[6].x + 1,
          curvePoints[6].y + 1.3,
          curvePoints[6].z + 33
        ),
        rotation: [0, 0, 0],
        title: "2018",
        subtitle: `The historically lower incomes in these areas have also resulted in historically lower access to quality resources, making it much harder for those born into poverty to escape it. `,
        image: '../images/woman-original.png'
      },
      {
        cameraRailDist: 0,
        position: new Vector3(
          curvePoints[7].x,
          curvePoints[7].y + 1.3,
          curvePoints[7].z - 10
        ),
        rotation: [0, 0, 0],
        title: "2022+",
        subtitle: `The median value of owner-occupied homes stood at $684,900, with median gross rent at $1,981, and median income at $89,212. This indicates a shift from racial to financial segregation, perpetuating exclusionary practices. What implications might this have for the future?`,
        image: '../images/mom-child.png'

      },
    ];
  }, []);



  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.08);
    shape.lineTo(0, 0.08);

    return shape;
  }, [curve]);

  const cameraGroup = useRef();
  const cameraRail = useRef();
  const camera = useRef();
  const scroll = useScroll();
  const lastScroll = useRef(0);

  // const { play, setHasScroll, end, setEnd } = usePlay();

  useFrame((_state, delta) => {
    if (window.innerWidth > window.innerHeight) {
      // LANDSCAPE
      camera.current.fov = 30;
      camera.current.position.z = 5;
    } else {
      // PORTRAIT
      camera.current.fov = 80;
      camera.current.position.z = 2;
    }

    // if (lastScroll.current <= 0 && scroll.offset > 0) {
    //   setHasScroll(true);
    // }

    if (sceneOpacity.current < 1) {
      sceneOpacity.current = THREE.MathUtils.lerp(
        sceneOpacity.current,
        1,
        delta * 0.1
      );
    }

    if (sceneOpacity.current > 0) {
      sceneOpacity.current = THREE.MathUtils.lerp(
        sceneOpacity.current,
        0,
        delta
      );
    }

    lineMaterialRef.current.opacity = 0.15;

    // if (end) {
    //   return;
    // }

    const scrollOffset = Math.max(0, scroll.offset);

    let friction = 1;
    let resetCameraRail = true;
    // LOOK TO CLOSE TEXT SECTIONS
    textSections.forEach((textSection) => {
      const distance = textSection.position.distanceTo(
        cameraGroup.current.position
      );

      if (distance < FRICTION_DISTANCE) {
        friction = Math.max(distance / FRICTION_DISTANCE, 0.1);
        const targetCameraRailPosition = new Vector3(
          (1 - distance / FRICTION_DISTANCE) * textSection.cameraRailDist,
          0,
          0
        );
        cameraRail.current.position.lerp(targetCameraRailPosition, delta);
        resetCameraRail = false;
      }
    });
    if (resetCameraRail) {
      const targetCameraRailPosition = new Vector3(0, 0, 0);
      cameraRail.current.position.lerp(targetCameraRailPosition, delta);
    }

    // CALCULATE LERPED SCROLL OFFSET
    let lerpedScrollOffset = THREE.MathUtils.lerp(
      lastScroll.current,
      scrollOffset,
      delta * friction
    );
    // PROTECT BELOW 0 AND ABOVE 1
    lerpedScrollOffset = Math.min(lerpedScrollOffset, 1);
    lerpedScrollOffset = Math.max(lerpedScrollOffset, 0);

    lastScroll.current = lerpedScrollOffset;
    // tl.current.seek(lerpedScrollOffset * tl.current.duration());

    const curPoint = curve.getPoint(lerpedScrollOffset);

    // Follow the curve points
    cameraGroup.current.position.lerp(curPoint, delta * 24);

    // Make the group look ahead on the curve

    const lookAtPoint = curve.getPoint(
      Math.min(lerpedScrollOffset + CURVE_AHEAD_CAMERA, 1)
    );

    const currentLookAt = cameraGroup.current.getWorldDirection(
      new THREE.Vector3()
    );
    const targetLookAt = new THREE.Vector3()
      .subVectors(curPoint, lookAtPoint)
      .normalize();

    const lookAt = currentLookAt.lerp(targetLookAt, delta * 24);
    cameraGroup.current.lookAt(
      cameraGroup.current.position.clone().add(lookAt)
    );



    if (
      cameraGroup.current.position.z <
      curvePoints[curvePoints.length - 1].z + 100
    ) {
      // setEnd(true);
      // planeOutTl.current.play();
    }
  });


  const tl = useRef();
  const backgroundColors = useRef({
    colorA: "#9A9380",
    colorB: "#766F5C",
    colorC: "#FFF8E6",
  });


  useFrame((_state, delta) => {

    const scrollOffset = Math.max(0, scroll.offset);

    //set scroll position for menu
    setCurrentSection(Math.floor(scrollOffset * 10));

    //Calculate lerped scroll offset
    let lerpedScrollOffset = THREE.MathUtils.lerp(
      lastScroll.current,
      scrollOffset,
      delta
    );

    lastScroll.current = lerpedScrollOffset;

    //get scroll position for background colors
    tl.current.seek(lerpedScrollOffset * tl.current.duration());

  });

  useEffect(() => {
    tl.current = gsap.timeline();
    bgColors.forEach(({ colorA, colorB, duration }) => {
      tl.current.to(backgroundColors.current, {
        duration,
        colorA,
        colorB,
      });
    });

    tl.current.pause();

  }, []);




  return useMemo(
    () => (
      <>
        <directionalLight position={[0, 3, 1]} intensity={0.1} />
        <group ref={cameraGroup}>
          <Background backgroundColors={backgroundColors} />

          <group ref={cameraRail}>
            <PerspectiveCamera
              ref={camera}
              position={[0, 0, 5]}
              fov={30}
              makeDefault
            />
          </group>

        </group>
        {/* TEXT */}
        {textSections.map((textSection, index) => (
          <TextSection {...textSection} key={index} />
        ))}

        {/* LINE */}
        <group position-y={-2}>
          <mesh>
            <extrudeGeometry
              args={[
                shape,
                {
                  steps: LINE_NB_POINTS,
                  bevelEnabled: false,
                  extrudePath: curve,
                },
              ]}
            />
            <meshStandardMaterial
              color={"white"}
              ref={lineMaterialRef}
              transparent
              envMapIntensity={2}
              onBeforeCompile={fadeOnBeforeCompile}
            />
          </mesh>
        </group>



      </>
    ),
    []
  );
};