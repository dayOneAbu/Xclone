import { useSession } from "next-auth/react"
import { VscHeartFilled, VscHeart } from "react-icons/vsc";
import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";
import { z } from "zod"


const btnSchema = z.object({
  small: z.boolean().default(false).optional(),
  gray: z.boolean().default(false).optional(),
  className: z.string().optional(),
}).passthrough()
type ButtonProps = z.infer<typeof btnSchema>
export function Button({
  small,
  gray,
  className = "",
  ...props }:
  ButtonProps & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
  const sizeClass = small ? "py-1 px-2" : "py-2 px-4 font-bold";
  const colorClass = gray
    ? "bg-gray-400 focus-visible:bg-gray-400 hover:bg-gray-400" :
    "focus-visible:bg-blue-400 hover:bg-blue-400 bg-blue-400"
  return (
    <button className={`rounded-full text-white transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${sizeClass} ${colorClass} ${className}`} {...props} ></button>
  )
}
export function HeartButton({ likeCount, likedByMe, onClick, isLoading }: {
  onClick: () => void
  likeCount: number,
  likedByMe: boolean
  isLoading: boolean
}) {
  const { status } = useSession()
  const HeartICon = likedByMe ? VscHeartFilled : VscHeart
  if (status !== "authenticated") {
    return (
      <div className="flex items-center self-start mx-1 mb-1 text-gray-500">
        <HeartICon />
        <span>{likeCount}</span>
      </div>
    )
  }
  return (
    <button onClick={onClick} disabled={isLoading} className={`transition-colors duration-200 group self-start flex
    items-center ${likedByMe ?
        "text-gray-500" :
        "text-gray-500 hover:text-red-500 focus-visible:text-red-500"}`
    }>
      <IconHoverEffect red>
        <HeartICon className={`transition-colors duration-200 ${likedByMe ?
          "fill-red-500" :
          "fill-gray-500 group-hover:fill-red-500 group-focus-visible:fill-red-500"
          }`} />
      </IconHoverEffect >
      <span>{likeCount}</span>
    </button>
  )
}


export function IconHoverEffect({ children, red = false }: {
  children: ReactNode,
  red?: boolean
}) {
  const colorClass = red ? "hover:bg-red-300 group-hover:bg-red-300 outline-red-300 group-focus-visible:bg-red-300 focus-visible:bg-red-300" : "hover:bg-gray-200 group-hover:bg-gray-200 outline-gray-200 group-focus-visible:bg-gray-200 focus-visible:bg-gray-200"
  return (
    <div className={`rounded-full transition-colors duration-200 py-2
      px-2 ${colorClass}`}>
      {children}
    </div>
  )
}