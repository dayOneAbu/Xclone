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
  const { data: sessionData } = useSession()
  const [inputValue, setInputValue] = useState("")
  const textAreaRef = useRef<HTMLTextAreaElement>()
  //  helps for automatically sizing the input box
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    UpdateTextAreaSize(textAreaRef.current)
    textAreaRef.current = textArea
  }, [])


  useLayoutEffect(() => {
    UpdateTextAreaSize(textAreaRef?.current)
  }, [inputValue])

  const createTweet = api.tweet.create.useMutation({
    onSuccess: newTweet => {
      console.log(newTweet)
    },
    onError: err => console.log(err)
  })
  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    createTweet.mutate({ content: inputValue })
    setInputValue("")

  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col border-b py-4 px-4">
      <div className="flex items-start gap-4">
        <ProfileImg src={sessionData?.user.image} />
        <textarea
          ref={inputRef}
          style={{ height: 0 }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex overflow-hidden text-lg p-4 resize-none outline-none"
          placeholder="what's happening ?"
        />
      </div>
      <Button text="Tweet" className="self-end" />
    </form>
  )
}