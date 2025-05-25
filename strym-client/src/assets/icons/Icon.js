import {ReactComponent as up} from './up.svg';
import {ReactComponent as down} from './down.svg';
import {ReactComponent as accountStroke} from './account-stroke.svg'
import {ReactComponent as accountFilled} from './account-filled.svg'
import {ReactComponent as bookmarkStroke} from './bookmark-stroke.svg'
import {ReactComponent as bookmarkFilled} from './bookmark-filled.svg'
import {ReactComponent as randomStroke} from './random-stroke.svg'
import {ReactComponent as randomFilled} from './random-filled.svg'
import {ReactComponent as strymStroke} from './strym-stroke.svg'
import {ReactComponent as strymFilled} from './strym-filled.svg'
import {ReactComponent as favoriteOutlined} from './favorite-stroke.svg'
import {ReactComponent as favoriteFilled} from './favorite-filled.svg'
import {ReactComponent as next} from './next.svg'
import {ReactComponent as prev} from './prev.svg'
import {ReactComponent as plus} from './plus.svg'
import {ReactComponent as minus} from './minus.svg'
import {ReactComponent as close} from './close.svg'
import {ReactComponent as business} from './business.svg'
import {ReactComponent as external} from './ic-external.svg'

const icons = {
    'up': up,
    'down': down,
    'account-stroke': accountStroke,
    'account-filled': accountFilled,
    'bookmark-stroke': bookmarkStroke,
    'bookmark-filled': bookmarkFilled,
    'random-stroke': randomStroke,
    'random-filled': randomFilled,
    'strym-stroke': strymStroke,
    'strym-filled': strymFilled,
    'favorite-stroke' : favoriteOutlined,
    'favorite-filled' : favoriteFilled,
    'next' : next,
    'prev' : prev,
    'plus' : plus,
    'minus' : minus,
    'close' : close,
    'business' : business,
    'external' : external,
}

export default function Icon({name, color, size}) {
    const SVGIcon = icons[name];
    const SVGColor = color
    const SVGSize = typeof(size) !== 'number' ? 24 : size;
    return(
        <SVGIcon
            width={SVGSize}
            height={SVGSize}
            fill={SVGColor}
        />
    )
}