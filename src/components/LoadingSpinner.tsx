import { VscRefresh } from "react-icons/vsc";

export default function LoadingSpinner({ isBig = false }) {
  return (
    <div className={`animate-spin flex items-center justify-center self-center ${isBig ? "h-20 w-20" : "h-10 w-10"}`}>
      <VscRefresh className="fill-blue-400 w-full h-full" />
    </div>
  )
}