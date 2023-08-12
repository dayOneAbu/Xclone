import { z } from "zod"
import InfiniteScroll from "react-infinite-scroll-component"
import Link from "next/link"
import ProfileImg from "./ProfileImg"
import { HeartButton, } from "./Button"
import { RouterOutputs, api } from "~/utils/api"
import LoadingSpinner from "./LoadingSpinner"


const DTFormatter = new Intl.DateTimeFormat()

export type Tweet = RouterOutputs["tweets"]["infiniteTweetFeed"]["tweets"][number]


export default function InfiniteTweetList({
  tweets,
  isLoading,
  isError,
  hasMore,
  fetchNewTweets
}: {
  tweets: Tweet[] | undefined,
  isLoading: boolean,
  isError: boolean,
  hasMore: boolean,
  fetchNewTweets: () => Promise<unknown>
}) {
  if (isLoading) return <LoadingSpinner isBig={true} />
  if (isError) return <h1>Error</h1>
  if (tweets?.length === 0 || !tweets) {
    return (<p className="mb-4 text-lg text-center text-gray-600">
      No Tweet yet!
    </p>)
  }
  return (
    <InfiniteScroll
      dataLength={tweets.length}
      hasMore={hasMore}
      next={fetchNewTweets}
      loader={<LoadingSpinner isBig={false} />}
    >
      <ul>
        {tweets && tweets.map(tweet => (
          <TweetCard
            id={tweet.id}
            content={tweet.content}
            createdAt={tweet.createdAt}
            likeCount={tweet.likeCount}
            likedByMe={tweet.likedByMe}
            user={tweet.user}
          />
        ))
        }
      </ul>
    </InfiniteScroll>

  )
}
export function TweetCard({
  id,
  content,
  createdAt,
  likeCount,
  likedByMe,
  user,
}: Tweet) {
  const trpcUtils = api.useContext()
  const toggleLike = api.tweets.likeTweet.useMutation({
    onSuccess: async ({ addedLike }) => {
      const updateData: Parameters<typeof trpcUtils.tweets.infiniteTweetFeed.setInfiniteData>[1] = (oldData) => {
        if (oldData == null) return
        const countModifier = addedLike ? 1 : -1
        return {
          ...oldData,
          pages: oldData.pages.map(page => {
            return {
              ...page,
              tweet: page.tweets.map(tweet => {
                if (tweet.id === id)
                  return {
                    ...tweet,
                    likeCount: tweet.likeCount + countModifier,
                    likedByMe: addedLike,
                  }
                return tweet
              })
            }
          })
        }
      }


      trpcUtils.tweets.infiniteTweetFeed.setInfiniteData({}, updateData)
      trpcUtils.tweets.infiniteTweetFeed.setInfiniteData({ followingTweets: true }, updateData)
      trpcUtils.tweets.infiniteProfileFeed.setInfiniteData({ userId: user.id || undefined }, updateData)
    }
  })

  function handleLike() {
    toggleLike.mutate({ id })
  }
  return (
    <li className="flex flex-row gap-4 px-4 py-4 border-b border-blue-200 rounded-xl">
      <Link href={`/profile/${user.id}`}>
        <ProfileImg src={user.image} />
      </Link>
      <div className="flex flex-col flex-grow">
        <div className="flex gap-1">
          <Link href={`/profile/${user.id}`}
            className="text-lg font-bold hover:underline focus-visible:underline"
          >
            {user.name}
          </Link>
          <span className="text-gray-500">-</span>
          <span className="text-gray-500">{DTFormatter.format(createdAt)}</span>
        </div>
        <p className="whitespace-pre-wrap">{content}</p>
        <HeartButton onClick={handleLike} isLoading={toggleLike.isLoading} likeCount={likeCount} likedByMe={likedByMe} />
      </div>
    </li>
  )
}
