import {useState} from 'react';
import {motion} from 'framer-motion';
import Icon from '../assets/icons/Icon';

export default function Place({title, summary, addr, img, isBusiness = false}) {
    const [isEllipsed, setisEllipsed] = useState(true);
    const [gradient, setGradient] = useState("rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5)");

    function handleSummary() {
        setisEllipsed(!isEllipsed);
        if(!isEllipsed) {
            setGradient("rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5)");
        } else {
            setGradient("rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)");
        }
    }

    const processImageUrl = (url) => {
        return url.replace(/\/(\d)\//, '/0$1/');
    }

    return(
        <motion.div
            className="w-full p-6 flex flex-col mb-8 justify-end rounded-[32px] overflow-hidden shadow-xl"
            style={{
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "calc(100vh - 5.75rem)",
                backgroundImage: `linear-gradient(${gradient}), url(${processImageUrl(img)})`
            }}
            transition={{duration: 0.3}}>
            <div className="w-full flex flex-col gap-6 justify-start items-start mb-20">
                <div className="w-full flex flex-col gap-3">
                    {isBusiness ? (
                        <div className="flex flex-row w-fit gap-1 items-center justify-center rounded-full bg-black/20 font-medium text-white text-sm py-1.5 px-3">
                            <Icon name="business" color="#FFC04A" size={20}/>
                            비즈니스 피드
                        </div>
                    ) : '' }
                    
                    <div className="text-3xl font-bold text-white">
                        {title}
                    </div>
                    <button
                        className={`text-left text-base font-normal text-white ${isEllipsed ? "line-clamp-2" : ""}`}
                        onClick={handleSummary}>
                        {summary}
                    </button>
                </div>
                <div className="w-full flex px-4 py-3 rounded-2xl bg-black/5 border border-white/10 backdrop-blur-[32px] justify-start items-center text-white">
                    {addr}
                </div>
            </div>
        </motion.div>
    )
}