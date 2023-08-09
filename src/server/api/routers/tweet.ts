import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const tweetRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        content: z.string(),
      })
    )
    .mutation(async ({ input: { content }, ctx }) => {
      return await ctx.prisma.tweet.create({
        data: {
          content: content,
          userId: ctx.session.user.id,
        },
      });
    }),
  // get unlimited tweets
  infiniteTweetFeed: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z
          .object({
            id: z.string(),
            createdAt: z.date(),
          })
          .optional(),
      })
    )
    .query(async ({ input: { limit = 10, cursor }, ctx }) => {
      const logged_user = ctx.session?.user.id;
      const data = await ctx.prisma.tweet.findMany({
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: {
          id: true,
          content: true,
          createdAt: true,
          _count: { select: { Like: true } },
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          Like:
            logged_user == null
              ? false
              : {
                  where: {
                    userId: logged_user,
                  },
                },
        },
      });

      let nextCursor: typeof cursor | undefined;
      if (data.length > limit) {
        const nextItem = data.pop();
        if (nextItem != null) {
          nextCursor = { id: nextItem?.id, createdAt: nextItem?.createdAt };
        }
      }
      return {
        tweet: data.map((item) => {
          return {
            id: item.id,
            content: item.content,
            createdAt: item.createdAt,
            likeCount: item._count.Like,
            likedByMe: item.Like?.length > 0,
            user: item.user,
          };
        }),
        nextCursor,
      };
    }),

  likeTweet: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      const userId = ctx.session.user.id;
      const tweetLike = await ctx.prisma.like.findUnique({
        where: {
          userId_tweetId: { tweetId: id, userId },
        },
      });
      if (!tweetLike) {
        await ctx.prisma.like.create({
          data: { tweetId: id, userId },
        });
        return { addedLike: true };
      } else {
        await ctx.prisma.like.delete({
          where: { userId_tweetId: { tweetId: id, userId } },
        });
        return { addedLike: false };
      }
    }),
});
