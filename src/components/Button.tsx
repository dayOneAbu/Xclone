import { z } from "zod"


const btnSchema = z.object({
  small: z.boolean().default(false).optional(),
  gray: z.boolean().default(false).optional(),
  className: z.string().optional(),
  text: z.string()
}).passthrough()
type ButtonProps = z.infer<typeof btnSchema>
export function Button({ small, gray, className = "", text, ...props }: ButtonProps) {
  const sizeClass = small ? "py-1 px-2" : "py-2 px-4 font-bold";
  const colorClass = gray
    ? "bg-gray-400 focus-visible:bg-gray-400 hover:bg-gray-400" :
    "focus-visible:bg-blue-400 hover:bg-blue-400 bg-blue-400"
  return (
    <button className={`rounded-full text-white transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${sizeClass} ${colorClass} ${className}`} {...props} >{text}</button>
  )
}
