import Image from "next/image";
import { VscAccount } from "react-icons/vsc";
import { z } from "zod"



const profileSchema = z.object({
  src: z.string().nullish(),
  className: z.string().optional(),
})
type ProfileImgProps = z.infer<typeof profileSchema>

export default function ProfileImg({ src, className }: ProfileImgProps) {
  return (
    <div className={`relative h-12 w-12 overflow-hidden rounded-full ${className}`}>
      {src == null ? (<VscAccount className="w-8 h-8 fill-gray-300" />) : (
        <Image src={src} alt="Profile image" quality={100} fill />
      )}
    </div>
  )
}