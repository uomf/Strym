import { useRef, useCallback } from 'react';

// ease-in-out 효과를 위한 함수
const easeInOut = (t) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

export const useMapAnimation = (map) => {
    const animationTimerRef = useRef(null);
    const isAnimatingRef = useRef(false);

    const moveToLocation = useCallback((newLat, newLng, centerDivRef) => {
        if (map && centerDivRef.current) {
            // 이미 애니메이션 중이면 이전 애니메이션 취소
            if (isAnimatingRef.current) {
                if (animationTimerRef.current) {
                    clearTimeout(animationTimerRef.current);
                }
                isAnimatingRef.current = false;
            }

            // pin의 위치 계산
            const centerDiv = centerDivRef.current;
            const rect = centerDiv.getBoundingClientRect();
            const pinX = rect.left + rect.width / 2;
            const pinY = rect.top + rect.height / 2;

            // 지도 컨테이너의 중앙 위치 계산
            const mapContainer = map.getDiv();
            const mapRect = mapContainer.getBoundingClientRect();
            const mapCenterX = mapRect.left + mapRect.width / 2;
            const mapCenterY = mapRect.top + mapRect.height / 2;

            // pin과 지도 중앙의 차이 계산
            const xDiff = pinX - mapCenterX;
            const yDiff = pinY - mapCenterY;

            // 현재 보이는 영역의 크기로부터 위도/경도 차이 계산
            const bounds = map.getBounds();
            const ne = bounds.getNorthEast();
            const sw = bounds.getSouthWest();
            
            // 픽셀 차이를 위도/경도 차이로 변환
            const offsetLat = (ne.lat() - sw.lat()) * (yDiff / mapRect.height);
            const offsetLng = (ne.lng() - sw.lng()) * (xDiff / mapRect.width);

            // 보정된 새로운 중심점 계산
            const newCenter = {
                lat: newLat - offsetLat,
                lng: newLng - offsetLng
            };

            const currentCenter = map.getCenter();
            const latDiff = newCenter.lat - currentCenter.lat();
            const lngDiff = newCenter.lng - currentCenter.lng();
            
            // 부드러운 이동을 위해 여러 단계로 나누어 이동
            const steps = 30;
            let currentStep = 0;
            isAnimatingRef.current = true;

            // 현재 줌 레벨 저장
            const currentZoom = map.getZoom();
            const targetZoom = currentZoom;

            const moveStep = () => {
                if (currentStep < steps && isAnimatingRef.current) {
                    // ease-in-out 효과 적용
                    const progress = currentStep / steps;
                    const easedProgress = easeInOut(progress);
                    
                    // 위치 이동
                    const nextLat = currentCenter.lat() + (latDiff * easedProgress);
                    const nextLng = currentCenter.lng() + (lngDiff * easedProgress);
                    
                    // 줌 레벨 변화 (중간에 가장 낮아졌다가 다시 올라오도록)
                    const zoomProgress = Math.sin(progress * Math.PI); // 0 -> 1 -> 0
                    const nextZoom = targetZoom - (zoomProgress * 0.3); // 줌 레벨 변화를 0.5로 감소
                    
                    map.panTo({ lat: nextLat, lng: nextLng });
                    map.setZoom(nextZoom);
                    
                    currentStep++;
                    animationTimerRef.current = setTimeout(moveStep, 30);
                } else if (isAnimatingRef.current) {
                    // 애니메이션이 완료된 경우에만 center 값 업데이트
                    return {
                        center: newCenter,
                        zoom: targetZoom
                    };
                }
            };
            
            return moveStep();
        }
    }, [map]);

    return { moveToLocation };
}; 