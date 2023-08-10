import { useSession } from "next-auth/react";
import { Button } from "./Button";
import ProfileImg from "./ProfileImg";
import { FormEvent, useCallback, useLayoutEffect, useRef, useState } from "react";
import { api } from "~/utils/api";
export function UpdateTextAreaSize(textArea?: HTMLTextAreaElement) {
  if (!textArea) return
  textArea.style.height = "0",
    textArea.style.height = `${textArea.scrollHeight}px`
}
export default function NewTweetForm() {
  const { status } = useSession()
  if (status != "authenticated") return null
  return (<TweetForm />)
}

export function TweetForm() {
  const { data: sessionData, status } = useSession()
  const [inputValue, setInputValue] = useState("")
  const trpcUtils = api.useContext()
  const textAreaRef = useRef<HTMLTextAreaElement>()
  //  helps for automatically sizing the input box
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    UpdateTextAreaSize(textAreaRef.current)
    textAreaRef.current = textArea
  }, [])
  useLayoutEffect(() => {
    UpdateTextAreaSize(textAreaRef?.current)
  }, [inputValue])

  const createTweet = api.tweets.create.useMutation({
    onSuccess: newTweet => {
      setInputValue("")
      if (status == "unauthenticated" || sessionData == null) return
      trpcUtils.tweets.infiniteTweetFeed.setInfiniteData({}, (oldData) => {
        if (oldData == null || oldData.pages[0] == null) {
          return
        }
        const cacheTweet = {
          ...newTweet,
          likeCount: 0,
          likedByMe: false,
          user: {
            id: sessionData.user.id,
            name: sessionData?.user.name || null,
            image: sessionData?.user.image || null
          }
        }
        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              tweets: [
                cacheTweet,
                ...oldData.pages[0].tweets
              ]
            },
            ...oldData.pages.slice(1)
          ]
        }
      })
    },
    onError: err => console.log(err)
  })
  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    createTweet.mutate({ content: inputValue })
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-start max-w-3xl px-4 py-4 m-4 bg-gray-200 border-b rounded shadow">
      <div className="flex items-start gap-4 my-4 ">
        <ProfileImg src={sessionData?.user.image} />
        <textarea
          rows={20}
          cols={70}
          ref={inputRef}
          style={{ height: 0 }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex w-full p-4 overflow-hidden text-lg outline-none resize-none"
          placeholder="what's happening ?"
        />
      </div>
      <Button type="submit" className="self-end" >Tweet</Button>
    </form>
  )
}