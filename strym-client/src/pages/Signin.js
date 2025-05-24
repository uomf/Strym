import logo from '../assets/logo-signature.svg';
import icGoogle from '../assets/ic-google.svg';

export default function Signin({isExpired}) {
    const oAuthURL = `${process.env.REACT_APP_STRYM_API_URL}/login`;
    const Caption = () => {
        return(
            <p className='text-sm text-gray-500 text-center'>
                계속함으로써, Strym의&nbsp;
                <button className='underline'>개인정보보호정책</button>
                &nbsp;및
                <br />
                <button className='underline'>이용약관</button>
                에 동의하는 것으로 간주합니다.
            </p>
        )
    }
    const handleGoogleSignin = async() => {
        try {
            window.location.href = oAuthURL;
        } catch(error) {
            console.error('Error signing in with Google:', error);
        }
    }
    return(
        <div
            className="w-full h-[100vh] flex flex-col justify-start items-start" 
            style={{
                background: "radial-gradient(100vw 60vh ellipse at 100% 100%, #FFDEE9, #F9AFC8, #FFDEC1, #FFFFFF)",
                transfrom: "rotate(30deg)",
            }}>
            <header className="w-full p-16 flex items-center justify-center">
                <img className="mr-2" alt="logo" src={logo} />
            </header>
            <main className="w-full p-12 flex flex-col gap-12 items-start flex-grow">
                <article className='w-full flex flex-col gap-4 items-center'>
                    <h1 className='text-center text-black font-bold text-4xl'>
                        {isExpired ? "세션이 만료되었습니다." : "환영합니다" }
                    </h1>
                    <p className='text-center font-medium text-base text-gray-600'>
                        {isExpired ? "다시 로그인 하세요." : "별도의 회원가입 없이, Google 계정으로 한 번에 로그인 하세요."}
                    </p>
                </article>
                <section className='w-full flex flex-col gap-4 justify-center items-center'>
                    <button
                        type='button'
                        className='w-80 flex flex-row gap-4 rounded-full p-4 border border-gray-200 bg-opacity-10 bg-gray-300'
                        onClick={handleGoogleSignin}
                    >
                        <img alt="Google Logo" src={icGoogle} />
                        <p className='font-semibold'>Google 계정으로 계속하기</p>
                    </button>
                    {isExpired ? <></> : <Caption></Caption>}
                </section>
            </main>
            <footer className='w-full p-6 flex align-middle justify-center text-sm text-gray-500 font-normal'>
                © 2025 Strym
            </footer>
        </div>
    )
}