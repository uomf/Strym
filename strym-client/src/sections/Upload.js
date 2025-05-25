import Place from "../components/Place";
import Icon from "../assets/icons/Icon";
import Input from "../components/Input";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {setDefaults, fromAddress} from "react-geocode";

setDefaults({
    key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    language: "ko",
    region: "kr"
})

export default function Upload() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [addr, setAddr] = useState("");
    const [img, setImg] = useState(null);
    const [imgUrl, setImgUrl] = useState("");
    const [isFilledInfo, setIsFilledInfo] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const navigate = useNavigate();

    const titleInputRef = useRef(null);
    const descriptionInputRef = useRef(null);
    const addrInputRef = useRef(null);
    const imgInputRef = useRef(null);
    
    const handleTitle = (title) => {
        if(title.length > 0) {
            setTitle(title);
        } else {
            setTitle("");
        }
    }

    const handleSummary = (summary) => {
        if(summary.length > 0) {
            setDescription(summary);
        } else {
            setDescription("");
        }
    }

    const handleAddr = (addr) => {
        if(addr.length > 0) {
            setAddr(addr);
        } else {
            setAddr("");
        }
    }

    const handleImg = (img, url) => {
        setImg(img);
        setImgUrl(url);
    }
    
    const getGeocode = async (addr) => {
        return await fromAddress(addr)
            .then(({ results }) => {
                const { lat, lng } = results[0].geometry.location;
                return {lat, lng};
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleUpload = async () => {
        try {
            const coord = await getGeocode(addr);
            const postFeed = await axios.post(`${process.env.REACT_APP_STRYM_API_URL}/place/upload`, {
                contentId: 202021148,
                title: title,
                imageURL: 'https://images.unsplash.com/photo-1569096651661-820d0de8b4ab?q=80&w=2188&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                siteURL: null,
                addr: addr,
                zipCode: 0,
                description: description,
                lat: coord.lat,
                lng: coord.lng,
                likeCount: 0
            }, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            console.log(postFeed.data);
            setIsFilledInfo(false);
            setIsUploaded(true);
        } catch (err) {
            console.log(err.response)
            if(err.response.status === 401) {
                navigate('/signout');
            }
        }
    }
    
    useEffect(() => {
        if(title.length > 0 && description.length > 0 && addr.length > 0 && img !== null) {
            setIsFilledInfo(true);
        } else {
            setIsFilledInfo(false);
        }
    }, [title, description, addr, img]);

    return (
        <div className="w-full h-screen relative flex flex-row px-8">
            <div className='max-w-[646px] h-[100vh] relative pointer-events-auto' style={{width: '50%'}}>
                <div className='absolute px-8 w-full h-full overflow-y-scroll scrollbar-hide pt-12'
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}>
                    <Place
                        title={title || "장소의 이름을 입력해주세요."}
                        summary={description || "장소의 설명을 입력해주세요."}
                        addr={addr || "주소를 입력해주세요."}
                        img={imgUrl}
                        isBusiness={true} />
                </div>
                <div
                    className='sticky flex flex-col items-center'
                    style={{
                        top: "calc(100vh - 124px)"
                    }}>
                        <div className="px-4 py-3 flex flex-row gap-1 bg-white shadow-md rounded-full">
                            <Icon name="strym-filled" color="#FF1251" size={24}/>
                            <div className="text-lg font-medium">피드가 이런 모습으로 보여요!</div>
                        </div>
                </div>
            </div>
            <div className="flex-grow relative flex flex-col gap-8 py-12 justify-between px-8">
                <div className="flex flex-col gap-4">
                    <h1 className='text-black font-bold text-3xl'>비즈니스 피드 업로드</h1>
                    <div className="font-medium text-gray-500 mb-4">비즈니스 피드를 업로드해서 방문율을 증가시켜 보세요!</div>
                    <Input
                        ref={titleInputRef}
                        title="제목"
                        type="text"
                        placeholder="장소의 이름을 입력해주세요."
                        handleEvent={handleTitle} />
                    <Input
                        ref={descriptionInputRef}
                        title="피드 설명"
                        type="text"
                        placeholder="장소의 설명을 입력해주세요."
                        handleEvent={handleSummary}/>
                    <Input
                        ref={addrInputRef}
                        title="주소"
                        type="text"
                        placeholder="주소를 입력해주세요."
                        handleEvent={handleAddr}/>
                    <Input
                        ref={imgInputRef}
                        title="피드 사진"
                        type="file"
                        handleEvent={handleImg}/>
                </div>
                <button
                    className={
                        `w-full px-3 py-4 rounded-lg 
                        ${isFilledInfo ?
                            "text-white bg-[radial-gradient(ellipse_141.42%_344.75%_at_0.00%_0.00%,_#FF1C86_0%,_#FF9941_50%,_#C315CF_100%)] shadow-[0px_0px_24px_0px_rgba(255,10,10,0.25)]" :
                            "text-gray-400 bg-gray-100"
                        }
                    `}
                    onClick={handleUpload}
                    disabled={!isFilledInfo || isUploaded}>
                        {isUploaded ? "피드 업로드 완료" : "피드 업로드"}
                </button>
            </div>
        </div>
    );
}