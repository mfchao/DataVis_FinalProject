import { useEffect, useState } from "react";


export const Menu = (props) => {
    const { onSectionChange, currentSection } = props;


    const [lineWidth, setLineWidth] = useState(null);


    useEffect(() => {
        if (currentSection === 0) {
            setLineWidth("w-[0.5rem]");
        } else if (currentSection === 1) {
            setLineWidth("w-[1.5rem]");
        } else if (currentSection === 2) {
            setLineWidth("w-[11.5rem]");
        } else if (currentSection === 3) {
            setLineWidth("w-[21.5rem]");
        } else if (currentSection === 4) {
            setLineWidth("w-[31.5rem]");
        } else if (currentSection === 5) {
            setLineWidth("w-[41.5rem]");
        } else if (currentSection === 6) {
            setLineWidth("w-[45.5rem]");
        } else if (currentSection === 7) {
            setLineWidth("w-[51.5rem]");
        } else if (currentSection === 8) {
            setLineWidth("w-[56.5rem]");
        } else if (currentSection >= 9) {
            setLineWidth("w-[61.6rem]");
        } else {
            setLineWidth("w-[1rem]");
        }
    }, [currentSection]);

    return (
        <>

            <div className="fixed top-10 left-1/2 transform -translate-x-1/2 w-full max-w-screen-lg">
                <div className="relative">
                    <div className={`rounded-xl h-0.5 transition-all m-1.5 ease-in-out duration-1000 bg-black ${lineWidth} opacity-60`}></div>
                    <div className="absolute ml-1.5 top-0 w-full h-0.5 bg-black bg-opacity-50 opacity-20"></div>
                </div>
                <div className="flex flex-row SF-Compact-Semibold text-xs tracking-wider mt-3 opacity-60 justify-between w-full">
                    <p className={`cursor-pointer mx-3 ease-in-out duration-1000 ${currentSection === 1 ? "opacity-100" : "opacity-20"}`} onClick={() => onSectionChange(1)}>1843</p>
                    <p className={`cursor-pointer mx-3 ease-in-out duration-1000 ${currentSection === 2 ? "opacity-100" : "opacity-20"}`} onClick={() => onSectionChange(2)}>1927</p>
                    <p className={`cursor-pointer mx-3 ease-in-out duration-1000 ${currentSection === 3 ? "opacity-100" : "opacity-20"}`} onClick={() => onSectionChange(3)}> 1938</p>
                    <p className={`cursor-pointer mx-3 ease-in-out duration-1000 ${currentSection === 4 ? "opacity-100" : "opacity-20"}`} onClick={() => onSectionChange(4)}>1960</p>
                    <p className={`cursor-pointer mx-3 ease-in-out duration-1000 ${currentSection === 5 || currentSection === 6 ? "opacity-100" : "opacity-20"}`} onClick={() => onSectionChange(5)}>1968</p>
                    <p className={`cursor-pointer mx-3 ease-in-out duration-1000 ${currentSection === 7 || currentSection === 8 ? "opacity-100" : "opacity-20"}`} onClick={() => onSectionChange(6)}>2018</p>
                    <p className={`cursor-pointer mx-3 ease-in-out duration-1000 ${currentSection >= 9 ? "opacity-100" : "opacity-20"}`} onClick={() => onSectionChange(9)}>2022</p>

                </div>
            </div>




        </>);
}




