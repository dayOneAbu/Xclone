import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { useContext } from "react";
export const profileRouter = createTRPCRouter({
  getProfileById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input: { id }, ctx }) => {
      const userId = ctx.session.user.id;
      const profile = await ctx.prisma.user.findUnique({
        where: {
          id: id,
        },
        select: {
          id: true,
          name: true,
          image: true,
          _count: {
            select: {
              follower: true,
              follows: true,
              Tweet: true,
            },
          },
          follower: userId != null ? { where: { id: userId } } : undefined,
        },
      });
      if (!profile) return;
      return {
        name: profile.name,
        image: profile.image,
        followerCount: profile._count.follower,
        followsCount: profile._count.follows,
        tweetCount: profile._count.Tweet,
        isFollowing: profile.follower.length > 0,
      };
    }),
  toggleFollow: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input: { userId }, ctx }) => {
      const loggedUser = ctx.session.user.id;
      const existingFollower = await ctx.prisma.user.findFirst({
        where: {
          id: userId,
          follower: {
            some: {
              id: loggedUser,
            },
          },
        },
      });
      let followed;
      if (existingFollower == null) {
        await ctx.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            follower: {
              connect: {
                id: loggedUser,
              },
            },
          },
        });
        followed = true;
      } else {
        await ctx.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            follower: {
              disconnect: {
                id: loggedUser,
              },
            },
          },
        });
        followed = false;
      }
      // revalidate
      void ctx.revalidateSSG?.(`/profile/${userId}`);
      void ctx.revalidateSSG?.(`/profile/${loggedUser}`);

      return { followed };
    }),
});
