import { useNavigate } from 'react-router-dom';
import Toggle from '../components/Toggle';
import BottomButton from '../components/BottomButton';
import Place from '../components/Place';
import {motion} from 'framer-motion';
import { useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';

export default function Strym({ isSlotMachine, places, onLoadMore, isLoading, hasMore, onPlaceChange }) {
    const navigate = useNavigate();
    const [currentPlaceIndex, setCurrentPlaceIndex] = useState(0);
    const placeRefs = useRef([]);
    const placePositions = useRef([]);
    const isScrolling = useRef(false);
    const lastScrollTime = useRef(0);
    const SCROLL_COOLDOWN = 500;
    const scrollTimeout = useRef(null);

    const [currentPlaceLikes, setCurrentPlaceLikes] = useState(0);
    const [currentIsBookmarked, setCurrentIsBookmarked] = useState(false);
    const [currentIsLiked, setCurrentIsLiked] = useState(false);

    const handleLike = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_STRYM_API_URL}/like/update/${places[currentPlaceIndex].id}`, {}, {   
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            // 좋아요 상태 업데이트
            const response = await axios.get(`${process.env.REACT_APP_STRYM_API_URL}/like/status/${places[currentPlaceIndex].id}`, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            setCurrentIsLiked(response.data);
            setCurrentPlaceLikes(prev => response.data ? prev + 1 : prev - 1);
        } catch (err) {
            console.error('좋아요 업데이트 실패:', err);
            if(err.response?.status === 401) {
                navigate('/signout');
            }
        }
    }

    const handleBookmark = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_STRYM_API_URL}/bookmark/update/${places[currentPlaceIndex].id}`, {}, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            // 북마크 상태 업데이트
            const response = await axios.get(`${process.env.REACT_APP_STRYM_API_URL}/bookmark/status/${places[currentPlaceIndex].id}`, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            setCurrentIsBookmarked(response.data);
        } catch (err) {
            console.error('북마크 업데이트 실패:', err);
            if(err.response?.status === 401) {
                navigate('/signout');
            }
        }
    }
    
    // currentPlaceIndex가 변경될 때마다 현재 Place의 ID를 출력
    useEffect(() => {
        if (!places || places.length === 0) return;
        const currentPlace = places[currentPlaceIndex];
        if (!currentPlace) return;

        console.log('=== Place 변경 시도 ===');
        console.log('현재 Place ID:', currentPlace.id);
        console.log('현재 Place Index:', currentPlaceIndex);

        const fetchPlaceInfo = async () => {
            try {
                console.log('=== API 요청 시작 ===');
                const [likeResponse, bookmarkResponse] = await axios.all([
                    axios.get(`${process.env.REACT_APP_STRYM_API_URL}/like/status/${currentPlace.id}`, {
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                            "Accept": "application/json",
                            "Content-Type": "application/json"
                        },
                        withCredentials: true
                    }),
                    axios.get(`${process.env.REACT_APP_STRYM_API_URL}/bookmark/status/${currentPlace.id}`, {
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                            "Accept": "application/json",
                            "Content-Type": "application/json"
                        },
                        withCredentials: true
                    })
                ]);

                console.log('=== API 응답 데이터 ===');
                console.log('좋아요 상태 응답:', {
                    data: likeResponse.data,
                    type: typeof likeResponse.data,
                    isTrue: likeResponse.data === true,
                    isFalse: likeResponse.data === false,
                    isTruthy: Boolean(likeResponse.data)
                });
                console.log('북마크 상태 응답:', {
                    data: bookmarkResponse.data,
                    type: typeof bookmarkResponse.data,
                    isTrue: bookmarkResponse.data === true,
                    isFalse: bookmarkResponse.data === false,
                    isTruthy: Boolean(bookmarkResponse.data)
                });

                // 상태 업데이트 전
                console.log('=== 상태 업데이트 전 ===');
                console.log('currentIsLiked:', currentIsLiked);
                console.log('currentIsBookmarked:', currentIsBookmarked);

                // 상태 업데이트
                const newIsLiked = likeResponse.data === true;
                const newIsBookmarked = bookmarkResponse.data === true;
                
                setCurrentIsLiked(newIsLiked);
                setCurrentIsBookmarked(newIsBookmarked);
                setCurrentPlaceLikes(currentPlace.likeCount);

                // 상태 업데이트 후
                console.log('=== 상태 업데이트 후 ===');
                console.log('newIsLiked:', newIsLiked);
                console.log('newIsBookmarked:', newIsBookmarked);

            } catch (err) {
                console.error('=== API 요청 실패 ===');
                console.error('에러:', err);
                if (err.response?.status === 401) {
                    navigate('/signout');
                }
                setCurrentIsLiked(false);
                setCurrentIsBookmarked(false);
                setCurrentPlaceLikes(currentPlace.likeCount);
            }
        }

        fetchPlaceInfo();
    }, [currentPlaceIndex, places, navigate]);

    const snapToPlace = useCallback((index) => {
        const container = placeRefs.current[0]?.parentElement;
        if (!container) return;
        
        isScrolling.current = true;
        const targetPosition = placePositions.current[index] - 48;
        container.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        const currentPlace = places[index];
        onPlaceChange(currentPlace);

        setTimeout(() => {
            isScrolling.current = false;
        }, 500);
    }, [onPlaceChange, places]);

    const findMostVisiblePlace = useCallback(() => {
        const container = placeRefs.current[0]?.parentElement;
        if (!container) return currentPlaceIndex;

        const scrollTop = container.scrollTop;
        const containerHeight = container.clientHeight;

        const visibilityRatios = placePositions.current.map((position, index) => {
            const nextPosition = placePositions.current[index + 1];
            const placeHeight = nextPosition ? nextPosition - position : containerHeight;
            
            const top = position - 48;
            const bottom = top + placeHeight;
            
            const visibleTop = Math.max(top, scrollTop);
            const visibleBottom = Math.min(bottom, scrollTop + containerHeight);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            
            return {
                index,
                ratio: visibleHeight / placeHeight
            };
        });

        return visibilityRatios.reduce((max, current) => 
            current.ratio > max.ratio ? current : max
        , { index: 0, ratio: 0 }).index;
    }, [currentPlaceIndex]);

    const handleWheel = useCallback((e) => {
        e.preventDefault();
        
        if (isScrolling.current) return;

        const now = Date.now();
        if (now - lastScrollTime.current < SCROLL_COOLDOWN) return;
        lastScrollTime.current = now;

        const container = placeRefs.current[0]?.parentElement;
        if (!container) return;

        // 스크롤 델타값이 너무 크면 무시 (트랙패드 스크롤 제어)
        const deltaY = Math.abs(e.deltaY);
        if (deltaY > 50) return; // 델타값 임계값을 50으로 낮춤

        // 스크롤 방향 결정 (델타값이 매우 작을 때는 무시)
        if (deltaY < 1) return;
        const direction = e.deltaY > 0 ? 1 : -1;

        // 현재 스크롤 위치에서 가장 가까운 Place 찾기
        const scrollTop = container.scrollTop;
        const currentPosition = scrollTop + 48; // 48px 오프셋 고려
        
        const currentIndex = placePositions.current.findIndex((position, index) => {
            const nextPosition = placePositions.current[index + 1];
            return currentPosition >= position && (!nextPosition || currentPosition < nextPosition);
        });

        // 현재 위치에서 direction 방향으로 한 칸만 이동
        const newIndex = Math.max(0, Math.min(places.length - 1, currentIndex + direction));
        
        if (newIndex !== currentPlaceIndex) {
            setCurrentPlaceIndex(newIndex);
            snapToPlace(newIndex);
        }

        // 스크롤이 마지막에 도달했는지 확인
        const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100; // 100px 여유 공간
        console.log('스크롤이 마지막에 도달했는지:', isAtBottom);
        console.log('hasMore 상태:', hasMore);
        if (isAtBottom && hasMore) {
            console.log('onLoadMore 호출');
            onLoadMore(); // 추가 데이터 로드
        }

        // 스크롤이 멈추면 가장 많이 보이는 Place로 스냅
        if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current);
        }
        scrollTimeout.current = setTimeout(() => {
            const mostVisibleIndex = findMostVisiblePlace();
            if (mostVisibleIndex !== currentPlaceIndex) {
                setCurrentPlaceIndex(mostVisibleIndex);
                snapToPlace(mostVisibleIndex);
            }
        }, 150);
    }, [currentPlaceIndex, snapToPlace, findMostVisiblePlace, hasMore, onLoadMore]);

    useEffect(() => {
        const container = placeRefs.current[0]?.parentElement;
        if (!container) return;

        if(isSlotMachine) {
            container.removeEventListener('wheel', handleWheel);
        } else {
            container.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            container.removeEventListener('wheel', handleWheel);
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }
        };
    }, [handleWheel, isSlotMachine]);

    const anim = {
        hidden: {opacity: 0},
        visible: {opacity: 100},
    }

    function handleSlotState(state) {
        if (state) {
            navigate('/slot');
        } else {
            navigate('/feed');
        }
    }

    // BottomButton 렌더링 전 상태 로그
    console.log('BottomButton 렌더링 전 상태:', {
        currentIsLiked,
        currentIsBookmarked,
        currentPlaceLikes,
        currentPlaceIndex
    });

    return(
        <div
            className='max-w-[646px] h-[100vh] relative'
            style={{width: '50%'}}>
            <div className='absolute px-8 w-full h-full overflow-y-scroll scrollbar-hide pt-12'
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',}}>
                {places.map((place, index) => (
                    <div
                        key={index}
                        ref={el => {
                            placeRefs.current[index] = el;
                            if (el) {
                                placePositions.current[index] = el.offsetTop;
                            }
                        }}
                        style={{
                            height: 'calc(100vh - 6rem)',
                            marginBottom: '2rem'
                        }}>
                        <Place
                            title={place.title}
                            summary={place.description}
                            addr={place.addr}
                            img={place.imageURL}
                            isBusiness={place.isUploaded} />
                    </div>
                ))}
                {isLoading && <div className="text-center py-4">로딩 중...</div>}
            </div>
            <motion.div
                variants={anim}
                animate={isSlotMachine ? "visible" : "hidden"}
                initial="hidden"
                transition={{duration: 0.5}}>
                    <div
                        className="absolute w-full top-3.5 pointer-events-none shadow-2xl"
                        style={{
                            height: 'calc(100vh - 1.5rem)',
                            borderRadius: '64px',
                            background: 'linear-gradient(135deg, #FF1C86, #FF9941, #C315CF)',
                            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                            WebkitMaskComposite: 'xor',
                            maskComposite: 'exclude',
                            padding: '16px',
                            boxSizing: 'border-box',
                        }}>
                    </div>
            </motion.div>
            <div className='sticky top-[76px] flex flex-col items-center'>
                <Toggle handle={handleSlotState} isSlotMachine={isSlotMachine}/>
            </div>
            <div
                className='sticky flex flex-col items-center'
                style={{
                    top: "calc(100vh - 132px)"
                }}>
                {isSlotMachine ? 
                    <BottomButton 
                        key={`bottom-button-${currentPlaceIndex}`}
                        isLiked={currentIsLiked} 
                        numOfLikes={currentPlaceLikes} 
                        isMarked={currentIsBookmarked} 
                        isSlotMachine={isSlotMachine} 
                        handleLike={handleLike}
                        handleBookmark={handleBookmark}
                    />
                    : 
                    <BottomButton 
                        key={`bottom-button-${currentPlaceIndex}`}
                        isLiked={currentIsLiked} 
                        numOfLikes={currentPlaceLikes} 
                        isMarked={currentIsBookmarked} 
                        isSlotMachine={isSlotMachine} 
                        handleLike={handleLike}
                        handleBookmark={handleBookmark}
                    />}
            </div>
        </div>
    )
}