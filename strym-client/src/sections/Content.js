import { useState, useCallback, useRef, useEffect } from 'react';
import Strym from '../sections/Strym';
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
    const [isSlotAnimationComplete, setIsSlotAnimationComplete] = useState(false);

    const onClickSlot = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_STRYM_API_URL}/place/roulette/20`, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            console.log("response.data: ", response.data.others);
            setPlaces(response.data.others);
            setIsSlotAnimationComplete(false);
            
            setTimeout(() => {
                const placeWrapper = document.querySelector('.place-wrapper');
                if (placeWrapper) {
                    // 먼저 최상단으로 이동
                    placeWrapper.scrollTo({
                        top: 0,
                        behavior: 'instant'
                    });

                    // 최상단 이동 후 애니메이션 시작
                    setTimeout(() => {
                        const startPosition = placeWrapper.scrollTop;
                        const targetPosition = placeWrapper.scrollHeight - placeWrapper.clientHeight - 40;
                        const distance = targetPosition - startPosition;
                        const duration = 5000; // 5초
                        const startTime = performance.now();

                        function easeOutCubic(t) {
                            return 1 - Math.pow(1 - t, 3);
                        }

                        function animateScroll(currentTime) {
                            const elapsed = currentTime - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            const easedProgress = easeOutCubic(progress);
                            
                            placeWrapper.scrollTop = startPosition + (distance * easedProgress);

                            if (progress < 1) {
                                requestAnimationFrame(animateScroll);
                            } else {
                                setIsSlotAnimationComplete(true);
                            }
                        }

                        requestAnimationFrame(animateScroll);
                    }, 100); // 최상단 이동 후 100ms 후에 애니메이션 시작
                }
            }, 100);
        } catch(error) {
            if(error.response.status === 401) {
                navigate('/signout');
            }
        }
    }

    const fetchPlaces = useCallback(async () => {
        try {
            setIsLoading(true);
            const resFeeds = await axios.get(`${process.env.REACT_APP_STRYM_API_URL}/place/get/5`, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            console.log("reponse.data: ", resFeeds.data);

            if(resFeeds.data.length < 5) {
                setHasMore(false);
            }

            const resUploads = await axios.get(`${process.env.REACT_APP_STRYM_API_URL}/user/uploads`, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            const displayPlaces = [...resFeeds.data, ...resUploads.data];

            setPlaces(prev => [...prev, ...displayPlaces]);

            const lastPlaceId = resFeeds.data[resFeeds.data.length - 1].id;
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
        handleLocationMove(place.lat, place.lng);
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
                        onClickSlot={onClickSlot}
                        isSlotMachine={isSlotMachine}
                        places={places}
                        onLoadMore={fetchPlaces}
                        isLoading={isLoading}
                        hasMore={hasMore}
                        onPlaceChange={handlePlaceChange}
                        isSlotAnimationComplete={isSlotAnimationComplete}
                    />
                    <div ref={centerDivRef} className='flex-grow relative'>
                        <div className='absolute inset-0 flex items-center justify-center'>
                            <img src={picPinSelected} alt='pin' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}