import { useState, useRef } from "react";
import Icon from "../assets/icons/Icon";

export default function Input({title, placeholder = "", type, handleEvent}) {
    const [isFilled, setIsFilled] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        if (e.target.value.length > 0) {
            setIsFilled(true);
        } else {
            setIsFilled(false);
        }

        handleEvent(e.target.value);
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // 이미지 미리보기 URL 생성
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            handleEvent(file, url);
        }
    }

    const handleClick = () => {
        fileInputRef.current.click();
    }

    const handleClear = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        handleEvent(null, null);
    }

    return (
        <div className="w-full flex flex-col gap-3 justify-start items-start">
            <label htmlFor={title} className="text-sm font-medium leading-snug text-gray-500">{title}</label>
            {type === "text" ? (
                <input
                    className={`${isFilled ? "ring-1 ring-green" : "ring-0"} w-full h-12 px-3 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue`}
                    type="text"
                    placeholder={placeholder}
                    onChange={handleChange} />
            ) : (
                <div>
                    <div className="relative">
                        {selectedFile !== null && (
                            <button
                                onClick={handleClear}
                                className="absolute -top-4 -right-4 w-10 h-10 bg-white hover:bg-gray-50 shadow-md rounded-full flex justify-center items-center p-1 z-10">
                                <Icon name="close" color="black" size={20}/>
                            </button>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange} />
                        <button
                            onClick={handleClick}
                            className="w-24 h-24 border border-gray-300 rounded-lg flex justify-center items-center cursor-pointer hover:bg-gray-50 overflow-hidden">
                            {previewUrl ? (
                                <img 
                                    src={previewUrl} 
                                    alt="미리보기" 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Icon name="plus" color="#999999" size={24}/>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}