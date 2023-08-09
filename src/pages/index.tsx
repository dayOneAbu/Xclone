import InfiniteTweetList from "~/components/InfiniteTweetList";
import NewTweetForm from "~/components/NewTweetForm";
import { api } from "~/utils/api";

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white px-2 py-2">
        <h1 className="mx-1 mb-4 py-4 font-medium text-xl">Home</h1>
      </header>
      <NewTweetForm />
      <RecentTweets />
    </>
  );
}
function RecentTweets() {
  const tweets = []
  const tweetFeeds = api.tweets.infiniteTweetFeed.useInfiniteQuery({},
    { getNextPageParam: lastPage => lastPage.nextCursor })

  return (
    <InfiniteTweetList
      tweets={tweetFeeds.data?.pages.flatMap(item => item.tweet)}
      isLoading={tweetFeeds.isLoading}
      isError={tweetFeeds.isError}
      hasMore={tweetFeeds.hasNextPage ?? false}
      fetchNewTweets={tweetFeeds.fetchNextPage}
    />
  )
}

// function AuthShowcase() {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.example.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// }
