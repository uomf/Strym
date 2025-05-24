import logoType from '../assets/logo-type.svg';
import Navigation from '../components/Navigation'

export default function Sidebar({role}) {
    return(
        <aside className="w-80 h-screen flex flex-col gap-4 justify-start items-start py-8 px-4 border-r border-gray-200">
            <div className="flex py-4 px-3 w-full flex-grow-0 select-none">
                <img alt="Strym logo" src={logoType} />
            </div>
            <Navigation role={role} />
            <footer className="flex justify-center flex-row items-center text-left align-middle text-sm text-gray-500 font-normal py-6 px-3 flex-grow-0">
                <p>© 2025 Strym</p>
            </footer>
        </aside>
    );
}