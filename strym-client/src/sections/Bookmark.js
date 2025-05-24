import { useState, useCallback, useEffect } from 'react';
import { Map } from '../components/Map';
import { OverlayView } from '@react-google-maps/api';
import Place from '../components/Place';
import defaultPin from '../assets/pic-pin-default.svg';
import selectedPin from '../assets/pic-pin-selected.svg';
import CircleButton from "../components/CircleButton";
import BottomButton from "../components/BottomButton";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MIN_ZOOM = 5;
const MAX_ZOOM = 12;

const BOUNDS = {
    north: 38.5,  // 북쪽 경계 (강원도 북부)
    south: 33.0,  // 남쪽 경계 (제주도 남부)
    east: 132.5,  // 동쪽 경계 (독도 포함)
    west: 120.5   // 서쪽 경계 (서해 중앙)
};

const initialCenter = {
    lat: 36.301186,
    lng: 126.5689622
};

const Pin = ({ place, isSelected, onClick }) => {
    return (
        <OverlayView
            position={{ lat: place.lat, lng: place.lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
            <div
                className="absolute cursor-pointer"
                style={{
                    left: '-50%',
                    top: '-100%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: isSelected ? 1000 : 1
                }}
                onClick={() => onClick(place.id)}
            >
                <img
                    src={isSelected ? selectedPin : defaultPin}
                    alt={place.title}
                    className="w-auto h-auto"
                    style={{
                        position: 'relative',
                        zIndex: isSelected ? 1000 : 1
                    }}
                />
            </div>
        </OverlayView>
    );
};

export default function Bookmark() {
    const navigate = useNavigate();
    const [zoom, setZoom] = useState(8);
    const [map, setMap] = useState(null);
    const [selectedPlaceId, setSelectedPlaceId] = useState(null);

    const [bookmarks, setBookmarks] = useState([]);

    useEffect(() => {
        const fetchBookmarks = async () => {
            axios.get(`${process.env.REACT_APP_STRYM_API_URL}/user/bookmarks`, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            }).then((res) => {
                setBookmarks(res.data);
                console.log(res.data)
                if (res.data.length > 0) {
                    setSelectedPlaceId(res.data[0].id);
                }
            }).catch((err) => {
                if(err.response.status === 401) {
                    navigate('/signout');
                }
            });
        }
        fetchBookmarks();
    }, []);

    const onLoad = useCallback((map) => {
        setMap(map);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    const onZoomChanged = useCallback(() => {
        if (map) {
            const currentZoom = map.getZoom();
            setZoom(currentZoom);
        }
    }, [map]);

    const handleZoomIn = useCallback(() => {
        if (map) {
            const currentZoom = map.getZoom();
            if (currentZoom < MAX_ZOOM) {
                map.setZoom(currentZoom + 1);
                setZoom(currentZoom + 1);
            }
        }
    }, [map]);

    const handleZoomOut = useCallback(() => {
        if (map) {
            const currentZoom = map.getZoom();
            if (currentZoom > MIN_ZOOM) {
                map.setZoom(currentZoom - 1);
                setZoom(currentZoom - 1);
            }
        }
    }, [map]);

    const handlePinClick = useCallback((placeId) => {
        setSelectedPlaceId(placeId);
    }, []);

    return(
        <div className='w-full h-screen relative'>
            <div className='absolute inset-0 z-0'>
                <Map
                    center={initialCenter}
                    zoom={zoom}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    onZoomChanged={onZoomChanged}
                    options={{
                        disableDefaultUI: true,
                        zoomControl: false,
                        mapTypeControl: false,
                        streetViewControl: false,
                        fullscreenControl: false,
                        gestureHandling: 'cooperative',
                        clickableIcons: false,
                        scrollwheel: true,
                        draggable: true,
                        keyboardShortcuts: false,
                        minZoom: MIN_ZOOM,
                        maxZoom: MAX_ZOOM,
                        restriction: {
                            latLngBounds: BOUNDS,
                            strictBounds: false
                        }
                    }}
                >
                    {bookmarks.map((place) => (
                        <Pin
                            key={place.id}
                            place={place}
                            isSelected={place.id === selectedPlaceId}
                            onClick={handlePinClick}
                        />
                    ))}
                </Map>
            </div>
            <div className='absolute right-8 top-1/2 -translate-y-1/2 z-[2]'>
            </div>
            <div className='absolute w-full h-full z-[2] pointer-events-none'>
                <div className='w-full h-screen flex flex-row gap-8 px-8 justify-start'>
                    <div className='max-w-[646px] h-[100vh] relative pointer-events-auto'
                        style={{width: '50%'}}>
                        <div className='absolute px-8 w-full h-full overflow-y-scroll scrollbar-hide pt-12'
                            style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                            }}>
                            <Place
                                title={bookmarks.find(place => place.id === selectedPlaceId)?.title || "북마크된 장소"}
                                summary={bookmarks.find(place => place.id === selectedPlaceId)?.description || "북마크한 장소들이 여기에 표시됩니다."}
                                addr={bookmarks.find(place => place.id === selectedPlaceId)?.addr || "주소"}
                                img={bookmarks.find(place => place.id === selectedPlaceId)?.imageURL || "data/img/load.png"} />
                        </div>
                        <div
                            className='sticky flex flex-col items-center'
                            style={{
                                top: "calc(100vh - 132px)"
                            }}>
                            <BottomButton 
                                isLiked={true} 
                                numOfLikes={325} 
                                isMarked={true} />
                        </div>
                    </div>
                    <div className='flex-grow relative'></div>
                    <div className="flex flex-col gap-3 px-8 items-center justify-center pointer-events-auto">
                        <CircleButton name="plus" isActivated={zoom >= MAX_ZOOM ? false : true} handle={handleZoomIn}/>
                        <CircleButton name="minus" isActivated={zoom <= MIN_ZOOM ? false : true} handle={handleZoomOut}/>
                    </div>
                </div>
            </div>
        </div>
    );
}