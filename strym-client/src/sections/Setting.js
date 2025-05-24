import { useNavigate } from "react-router-dom";

export default function Setting() {
    const navigate = useNavigate();

    const SettingList = ({title, handleClick}) => {
        return (
            <button className="w-full flex flex-row py-6 border-b border-gray-200 text-left" onClick={handleClick}>
                {title}
            </button>
        )
    }

    return(
        <div className='w-full h-screen relative p-16'>
            <div className="max-w-[646px] m-auto flex flex-col align-center justify-center">
                <SettingList title="서비스 이용약관" handleClick={() => window.open("https://naver.com", "_blank")}/>
                <SettingList title="개인정보 처리방침" handleClick={() => window.open("https://naver.com", "_blank")}/>
                <SettingList title="로그아웃" handleClick={() => navigate("/signin")}/>
                <SettingList title="계정탈퇴" handleClick={() => navigate("/resign")}/>
            </div>
        </div>
    )
}