import Icon from '../assets/icons/Icon';

export default function CircleButton({name, isActivated, handle}) {
    return(
        <button
            className={`w-16 h-16 p-5 bg-white ${isActivated ? 'hover:bg-gray-100' : ''} rounded-full shadow-md`}
            onClick={handle}>
            <Icon name={name} color={isActivated ? 'black' : 'rgba(134, 134, 134, 0.5)'} size={24} />
        </button>
    )
}