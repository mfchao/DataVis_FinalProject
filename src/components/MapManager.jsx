
import CoiVsSingleFamilyMapComponent from "./CoiVsSingleFamilyMapComponent";
import IncomeVsSingleFamilyMapComponent from "./IncomeVsSingleFamilyMapComponent";



export const MapManager = (props) => {
    const { currentSection, setMapOpened, openMap, setOpenMap } = props;

    const handleClick = () => {
        setOpenMap(null);
        setMapOpened(false);
        // setArchiveMapId(null);
    };

    return (
        <>
            <div
                className={`z-10 relative transition-all ease-in-out duration-700 `}
            >
                {/* <button className={`z-110000 fixed top-14 left-12  text-sm cursor-pointer text-white hover:text-rose-300 transition-colors  `}
                    onClick={handleClick}>
                    BACK
                </button> */}

                <div className={`z-10 absolute top-0 left-0 w-screen h-screen overflow-y-scroll transition-all ease-in-out duration-700 `}>
                    <CoiVsSingleFamilyMapComponent openMap={openMap} setOpenMap={setOpenMap} setMapOpened={setMapOpened} />
                    <IncomeVsSingleFamilyMapComponent openMap={openMap} setOpenMap={setOpenMap} setMapOpened={setMapOpened} />
                </div>




            </div>
        </>);
}





