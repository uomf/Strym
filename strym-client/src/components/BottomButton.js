import Icon from '../assets/icons/Icon'

function BtnLike({isLiked, numOfLikes, onLike}) {
    return(
        <button 
            className={`${isLiked ? "bg-red shadow-[0px_0px_16px_0px_rgba(255,37,59,0.50)]" : ""} text-white items-center flex flex-row gap-1 z-20 px-4 py-3 rounded-full font-semibold text-lg`}
            onClick={onLike}>
            <Icon name={isLiked ? "favorite-filled" : "favorite-stroke"} color={"white"} size={24} />
            {numOfLikes}
        </button>
    )
}

function BtnBookmark({isMarked, onBookmark}) {
    return(
        <button 
            className={'text-white items-center flex flex-row gap-1 z-20 px-4 py-3 rounded-full font-semibold text-lg'}
            onClick={onBookmark}>
            <Icon name={isMarked ? "bookmark-filled" : "bookmark-stroke"} color={isMarked ? "#ffbf4a" : "white"} size={24} />
            {isMarked ? "저장됨" : "북마크"}
        </button>
    )
}

function BtnStartSlot({onClickSlot}) {
    return(
        <button 
            className='bg-red shadow-[0px_0px_16px_0px_rgba(255,37,59,0.50)] text-white items-center flex flex-row gap-1 z-20 px-4 py-3 rounded-full font-semibold text-lg'
            onClick={onClickSlot}>
            <Icon name={"random-filled"} color={"white"} size={24} />
            랜덤 슬롯 시작하기
        </button>
    )
}

function BtnReStartSlot({onClickSlot}) {
    return(
        <button 
            className='bg-white text-black items-center flex flex-row gap-1 z-20 px-4 py-3 rounded-full font-semibold text-lg'
            onClick={onClickSlot}>
            <Icon name={"external"} color={"black"} size={24} />
            다시 돌리기
        </button>
    )
}

export default function BottomButton({onClickSlot, isLiked, numOfLikes, isMarked, isSlotMachine, handleLike, handleBookmark, isSlotAnimationComplete}) {
    return(
        <div className='relative flex flex-row p-2 gap-1 rounded-full backdrop-blur-3xl bg-black/5'>
            {
                isSlotMachine ? 
                (isSlotAnimationComplete ? 
                    <BtnReStartSlot onClickSlot={onClickSlot} />
                    :
                    <BtnStartSlot onClickSlot={onClickSlot} />
                )
                :
                <>
                <BtnLike 
                    isLiked={isLiked} 
                    numOfLikes={numOfLikes} 
                    onLike={handleLike}
                />
                <BtnBookmark 
                    isMarked={isMarked} 
                    onBookmark={handleBookmark}
                />
                </>
            }
        </div>
    )
}