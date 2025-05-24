import { GoogleMap } from '@react-google-maps/api';

const mapContainerStyle = {
    width: '100%',
    height: '100%'
};

const defaultMapOptions = {
    disableDefaultUI: true,
    zoomControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    gestureHandling: 'none',
    clickableIcons: false,
    scrollwheel: false,
    draggable: false,
    keyboardShortcuts: false,
};

export const Map = ({ 
    center, 
    zoom, 
    onLoad, 
    onUnmount,
    options = {},
    children 
}) => {
    // 기본 옵션과 사용자 정의 옵션을 병합
    const mapOptions = {
        ...defaultMapOptions,
        ...options
    };

    return (
        <div className='absolute inset-0 z-0'>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={zoom}
                options={mapOptions}
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
                <div className='w-[50%] absolute inset-0 bg-gradient-to-r from-white to-white/0 pointer-events-none'></div>
                {children}
            </GoogleMap>
            
        </div>
    );
}; 