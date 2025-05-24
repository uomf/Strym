import {useState, useRef, useLayoutEffect} from 'react';
import Icon from '../assets/icons/Icon';

export default function Toggle({handle}) {
    // true(Right), false(Left)
    const [currentMenu, setCurrentMenu] = useState(false);
    const [backgroundWidth, setBackgroundWidth] = useState(100);
    const [prevWidth, setPrevWidth] = useState(100);

    const btn1Ref = useRef(null);
    const btn2Ref = useRef(null);

    function handleCurrentMenu(state) {
        setCurrentMenu(state);
        handle(state);
    }

    // 의존성 배열은 무한루프에 빠질 수 있으니, 값을 변경하는 인자만 넣어야 함
    useLayoutEffect(() => {
        setTimeout(() => {
            if(!currentMenu && btn1Ref.current) {
                setPrevWidth(backgroundWidth);
                setBackgroundWidth(btn1Ref.current.offsetWidth);
            } else if(currentMenu && btn2Ref.current) {
                setPrevWidth(backgroundWidth);
                setBackgroundWidth(btn2Ref.current.offsetWidth);
            }
        }, 0);
    }, [currentMenu]);

    return(
        <div className='relative flex flex-row p-2 gap-1 rounded-full backdrop-blur-3xl bg-black/5'>
            <div 
                className="rounded-full bg-white absolute z-10"
                style={{
                    height: "calc(100% - 1rem)",
                    left: currentMenu ? `calc(${prevWidth}px + 0.75rem)` : "0.5rem",
                    width: `${backgroundWidth}px`, 
                    transition: "all 0.2s ease" }}
                ></div>
            <button 
                ref={btn1Ref} 
                className={`flex flex-row gap-1 z-20 px-4 py-3 rounded-full font-semibold text-lg ${currentMenu ? "text-white" : "text-black"}`}
                onClick={() => handleCurrentMenu(false)}>
                <Icon name={"strym-filled"} color={currentMenu ? "white" : "#ff1251"} size={24} />
                피드
            </button>
            <button 
                ref={btn2Ref} 
                className={`flex flex-row gap-1 z-20 px-4 py-3 rounded-full font-semibold text-lg ${currentMenu ? "text-black" : "text-white"}`}
                onClick={() => handleCurrentMenu(true)}>
                <Icon name={"random-filled"} color={currentMenu ? "#40DA7E" : "white"} size={24} />
                랜덤슬롯
            </button>
        </div>
    )
}