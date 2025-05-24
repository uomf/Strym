import CircleButton from "../components/CircleButton";

export default function Pagination({handleAction}) {
    return(
        <div className="flex flex-col gap-3 px-8 items-center justify-center">
            <CircleButton name="up" isActivated={false} />
            <CircleButton name="down" isActivated={true} handle={handleAction}/>
        </div>
    )
}