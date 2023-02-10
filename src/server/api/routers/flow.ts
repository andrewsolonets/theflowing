import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const flowRouter = createTRPCRouter({
  postUserData: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        name: z.string(),
        nodes: z.string(),
        viewport: z.string(),
        edges: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { userId, nodes, edges, name, viewport } = input;
      return ctx.prisma.userData.create({
        data: {
          user: { connect: { id: userId } },
          name,
          nodes,
          edges,
          viewport,
        },
      });
    }),
  getUserFlows: protectedProcedure.query(({ ctx }) => {
    const userId = ctx.session.user.id;
    return ctx.prisma.userData.findMany({
      where: { userId },
    });
  }),
  getSingleFlow: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    const id = input;
    return ctx.prisma.userData.findUnique({
      where: { id },
    });
  }),
  updateFlow: publicProcedure
    .input(
      z.object({
        id: z.string(),
        nodes: z.string(),
        edges: z.string(),
        viewport: z.string(),
        name: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { id, nodes, edges, name, viewport } = input;
      return ctx.prisma.userData.update({
        where: { id },
        data: {
          nodes,
          edges,
          name,
          viewport,
        },
      });
    }),
  postManyFlows: publicProcedure
    .input(
      z.array(
        z.object({
          userId: z.string(),
          id: z.string(),
          nodes: z.string(),
          edges: z.string(),
          viewport: z.string(),
          name: z.string(),
        })
      )
    )
    .mutation(({ ctx, input }) => {
      const data = input;
      return ctx.prisma.userData.createMany({
        data,
      });
    }),
});
