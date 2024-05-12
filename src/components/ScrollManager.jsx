import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";

export const ScrollManager = (props) => {
    const { section, onSectionChange, setScroll } = props;

    const data = useScroll();
    const lastScroll = useRef(0);
    const isAnimating = useRef(false);


    //correct scroll position
    data.fill.classList.add("top-0");
    data.fill.classList.add("absolute");

    useEffect(() => {
        gsap.to(data.el, {
            duration: 1,
            scrollTop: section * data.el.clientHeight,
            onStart: () => {
                isAnimating.current = true;
            },
            onComplete: () => {
                isAnimating.current = false;
            }
        })

    }, [section]);

    useFrame(() => {
        if (isAnimating.current) {
            lastScroll.current = data.scroll.current;
            return;
        }

        // setScroll(data.scroll.current)

        //Smooth Scroll forward
        // const curSection = Math.floor(data.scroll.current * totalPages);
        // if (data.scroll.current > lastScroll.current && curSection === 0) {
        //     onSectionChange(curSection + 1);
        // }


        //Smooth Scroll backwards
        // if (data.scroll.current < lastScroll.current &&
        //     data.scroll.current < 1 / (totalPages - 1)
        // ) {
        //     onSectionChange(lastSection);
        // } 

        lastScroll.current = data.scroll.current;
    })
    return null;
}