import { useEffect, useState } from "react";



export const Menu = (props) => {
    const { onSectionChange, currentSection, setOpenMap, setMapOpened, mapOpened, scroll } = props;

    const [section, setSection] = useState(null);

    const [lineWidth, setLineWidth] = useState(null);

    const handleClick = (section, currentSection) => {
        setSection(section);
        onSectionChange(currentSection);
        // console.log(currentSection);
        // setOpenStats(false);
    }

    const openStatsFunction = (section, currentSection) => {
        setSection(section);
        onSectionChange(currentSection);
        setMapOpened(true);
        setOpenMap("stat");
    }


    useEffect(() => {

        console.log(currentSection)
        if (currentSection === 0) {
            setLineWidth("w-[0.5rem]");
        } else if (currentSection === 1) {
            setLineWidth("w-[1.5rem]");
        } else if (currentSection === 2) {
            setLineWidth("w-[10.5rem]");
        } else if (currentSection === 3) {
            setLineWidth("w-[18.5rem]");
        } else if (currentSection === 4) {
            setLineWidth("w-[26.5rem]");
        } else if (currentSection === 5) {
            setLineWidth("w-[35.5rem]");
        } else if (currentSection === 6) {
            setLineWidth("w-[37.5rem]");
        } else if (currentSection === 7) {
            setLineWidth("w-[43.5rem]");
        } else if (currentSection === 8) {
            setLineWidth("w-[51.5rem]");
        } else if (currentSection >= 9) {
            setLineWidth("w-[61.6rem]");
        } else {
            setLineWidth("w-[1rem]");
        }
    }, [currentSection, section]);

    // useEffect(() => {
    //     // Calculate line width based on the scroll position
    //     const scrollPercentage = scroll * 100; 
    //     const lineWidth = `${scrollPercentage}%`; 
    //     setLineWidth(lineWidth);
    //     // console.log(lineWidth)
    // }, [scroll]);



    return (
        <>

            <div className="fixed top-10 left-1/2 transform -translate-x-1/2 w-full max-w-screen-lg">
                <div className="relative">
                    <div className={`rounded-xl h-0.5 transition-all m-1.5 ease-in-out duration-1000 ${mapOpened ? "bg-white" : "bg-black"}  ${lineWidth} opacity-60`}></div>
                    <div className={`absolute ml-1.5 top-0 w-full h-0.5 ${mapOpened ? "bg-white" : "bg-black"} bg-opacity-50 opacity-20`}></div>
                </div>
                <div className={`flex flex-row SF-Compact-Semibold text-xs tracking-wider mt-3 opacity-90 justify-between w-full ${mapOpened ? "text-white" : "text-black"}`}>
                    <p className={`cursor-pointer mx-3 ease-in-out duration-1000 ${currentSection === 1 ? "opacity-100" : "opacity-20"}`} onClick={() => handleClick(1843, 1.5)}>1843</p>
                    <p className={`cursor-pointer mx-3 ease-in-out duration-1000 ${currentSection === 2 ? "opacity-100" : "opacity-20"}`} onClick={() => handleClick(1927, 3)}>1927</p>
                    <p className={`cursor-pointer mx-3 ease-in-out duration-1000 ${currentSection === 3 ? "opacity-100" : "opacity-20"}`} onClick={() => handleClick(1938, 5)}> 1938</p>
                    <p className={`cursor-pointer mx-3 ease-in-out duration-1000 ${currentSection === 4 ? "opacity-100" : "opacity-20"}`} onClick={() => handleClick(1960, 6)}>1960</p>
                    <p className={`cursor-pointer mx-3 ease-in-out duration-1000 ${currentSection === 5 || currentSection === 6 ? "opacity-100" : "opacity-20"}`} onClick={() => handleClick(1968, 7)}>1968</p>
                    <p className={`cursor-pointer mx-3 ease-in-out duration-1000 ${currentSection === 7 ? "opacity-100" : "opacity-20"}`} onClick={() => handleClick(2018, 10.9)}>2018</p>
                    <p className={`cursor-pointer mx-3 ease-in-out duration-1000 ${currentSection === 8 ? "opacity-100" : "opacity-20"}`} onClick={() => handleClick(2022, 11.9)}>2022</p>
                    <p className={`cursor-pointer mx-3 ease-in-out duration-1000 ${currentSection === 10 ? "opacity-100" : "opacity-20"}`} onClick={() => openStatsFunction(null, 10)}>Statistics</p>

                </div>
            </div>




        </>);
}




