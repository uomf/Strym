import { Link, useLocation } from 'react-router-dom';
import icAccountActivated from '../assets/ic-account-activated.svg';
import icAccountDeactivated from '../assets/ic-account-deactivated.svg';
import icBookmarkActivated from '../assets/ic-bookmark-activated.svg';
import icBookmarkDeactivated from '../assets/ic-bookmark-deactivated.svg';
import icStrymActivated from '../assets/ic-strym-activated.svg';
import icStrymDeactivated from '../assets/ic-strym-deactivated.svg';
import icUploadActivated from '../assets/ic-upload-activated.svg';
import icUploadDeactivated from '../assets/ic-upload-deactivated.svg';

const icons = {
    feed: {
        activated: icStrymActivated,
        deactivated: icStrymDeactivated
    },
    bookmark: {
        activated: icBookmarkActivated,
        deactivated: icBookmarkDeactivated
    },
    setting: {
        activated: icAccountActivated,
        deactivated: icAccountDeactivated
    },
    upload: {
        activated: icUploadActivated,
        deactivated: icUploadDeactivated
    }
};

function List({ path }) {
    const location = useLocation();
    const isSelected = location.pathname === path || 
                      (path === '/feed' && location.pathname === '/slot');
    const nameMap = {
        feed: "스트림",
        bookmark: "북마크",
        setting: "계정",
        upload: "비즈니스 업로드",
    }

    return(
        <li>
            <Link
                to={path}
                className={`w-full flex flex-row gap-3 py-4 px-3 justify-start items-center rounded-xl transition ${isSelected ? "bg-gray-50" : ""}`}
            >
                <img alt='logo' src={isSelected ? icons[path.split('/')[1]].activated : icons[path.split('/')[1]].deactivated} />
                <p className={`text-lg ${isSelected ? "font-medium" : "text-gray-400 font-normal"}`}>{nameMap[path.split('/')[1]]}</p>
            </Link>
        </li>
    )
}

export default function Navigation( {role} ) {
    const menuList = [
        {id: 0, path: "/feed", title: "feed"},
        {id: 1, path: "/bookmark", title: "bookmark"},
        {id: 2, path: "/setting", title: "setting"},
        {id: 3, path: "/upload", title: "upload"}
    ]

    return(
        <nav className="flex flex-grow flex-col w-full overflow-auto">
            <ul>
                {menuList
                    .slice(0, role ? menuList.length : menuList.length - 1)
                    .map((menu) => (
                        <List 
                            key={menu.id} 
                            path={menu.path}
                        />
                    ))}
            </ul>
        </nav>
    );
}