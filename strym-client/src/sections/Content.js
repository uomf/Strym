import { useState, useCallback, useRef, useEffect } from 'react';
import Strym from '../sections/Strym';
import Pagination from './Pagination';
import { Map } from '../components/Map';
import { useMapAnimation } from '../hooks/useMapAnimation';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import picPinSelected from '../assets/pic-pin-selected.svg';

export default function Content({ isSlotMachine }) {

    const initialCenter = {
        lat: 36.301186,
        lng: 127.5689622
    };
    const [center, setCenter] = useState(initialCenter);
    const [map, setMap] = useState(null);
    const centerDivRef = useRef(null);
    const { moveToLocation } = useMapAnimation(map);
    const navigate = useNavigate();

    const [places, setPlaces] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchPlaces = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_STRYM_API_URL}/place/get/5`, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            console.log(response.data);

            if(response.data.length < 5) {
                setHasMore(false);
            }

            setPlaces(prev => [...prev, ...response.data]);

            const lastPlaceId = response.data[response.data.length - 1].id;
            const postLastPlaceId = await axios.post(`${process.env.REACT_APP_STRYM_API_URL}/user/lastSeen/${lastPlaceId}`, {}, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            console.log("Post 요청 응답: ", postLastPlaceId.data);

        } catch(error) {
            if(error.response.status === 401) {
                navigate('/signout');
            }
        }
    }, []);

    useEffect(() => {
        fetchPlaces();
        return () => {
            setMap(null);
        };
    }, []);

    const onLoad = useCallback((map) => {
        setMap(map);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    const handleLocationMove = useCallback((newLat, newLng) => {
        const result = moveToLocation(newLat, newLng, centerDivRef);
        if (result) {
            setCenter(result.center);
            map.setZoom(result.zoom);
        }
    }, [map, moveToLocation]);

    const handlePlaceChange = async (place) => {
        // const res = await axios.get(`${process.env.REACT_APP_STRYM_API_URL}/bookmark/status/${place.id}`, {
        //     headers: {
        //         'Access-Control-Allow-Origin': '*',
        //         'Content-Type': 'application/json',
        //     },
        //     withCredentials: true,
        // });
        // const isBookmarked = res.data;

        // console.log(place);
        // setCurrentPlaceLikes(place.likeCount);
        handleLocationMove(place.lat, place.lng);
        // setCurrentCoord({lat: place.lat, lng: place.lng})
        // setCurrentIsBookmarked(3423);
    };

    return(
        <div className='w-full h-screen relative'>
            <Map
                center={center}
                zoom={9}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
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
                }}
            />
            <div className='absolute w-full h-full z-[2]'>
                <div className='w-full h-screen flex flex-row gap-8 px-8 justify-start'>
                    <Strym
                        isSlotMachine={isSlotMachine}
                        places={places}
                        onLoadMore={fetchPlaces}
                        isLoading={isLoading}
                        hasMore={hasMore}
                        onPlaceChange={handlePlaceChange}
                    />
                    <div ref={centerDivRef} className='flex-grow relative'>
                        <div className='absolute inset-0 flex items-center justify-center'>
                            <img src={picPinSelected} alt='pin' />
                        </div>
                    </div>
                    {/* <Pagination
                        handleAction={[handleUp, handleDown]}
                        hasMore={hasMore}
                        isFirst={isFirst}
                    /> */}
                    <Pagination
                        hasMore={hasMore}
                    />
                </div>
            </div>
        </div>
    );
}