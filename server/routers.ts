import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  adminExists,
  createAdmin,
  loadProjects,
  saveProjects,
  verifyAdmin,
} from "./admin";
import type { Project } from "@shared/types";

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().min(1, "Icon is required"),
  link: z.string().url("Valid URL is required"),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Public routes
  projects: router({
    list: publicProcedure.query(async () => {
      const projects = await loadProjects();
      return projects;
    }),
  }),

  // Admin routes
  admin: router({
    checkSetup: publicProcedure.query(async () => {
      const exists = await adminExists();
      return { setupRequired: !exists };
    }),

    setup: publicProcedure
      .input(
        z.object({
          username: z.string().min(3, "Username must be at least 3 characters"),
          email: z.string().email("Invalid email"),
          password: z.string().min(6, "Password must be at least 6 characters"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const exists = await adminExists();
        if (exists) {
          throw new Error("Admin account already exists");
        }

        try {
          await createAdmin(input.username, input.email, input.password);

          // Set session cookie
          const sessionToken = "admin-session-" + Date.now();
          ctx.res.cookie(COOKIE_NAME, sessionToken, {
            ...getSessionCookieOptions(ctx.req),
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          });

          return { success: true };
        } catch (error) {
          throw new Error("Failed to setup admin account");
        }
      }),

    login: publicProcedure
      .input(
        z.object({
          username: z.string(),
          password: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const isValid = await verifyAdmin(input.username, input.password);
        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        // Set session cookie
        const sessionToken = "admin-session-" + Date.now();
        ctx.res.cookie(COOKIE_NAME, sessionToken, {
          ...getSessionCookieOptions(ctx.req),
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return { success: true };
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true };
    }),

    addProject: publicProcedure
      .input(projectSchema)
      .mutation(async ({ input }) => {
        const projects = await loadProjects();

        const newProject: Project = {
          id: "project-" + Date.now(),
          name: input.name,
          description: input.description,
          icon: input.icon,
          link: input.link,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        projects.push(newProject);
        await saveProjects(projects);

        return newProject;
      }),

    updateProject: publicProcedure
      .input(
        z.object({
          id: z.string(),
          ...projectSchema.shape,
        })
      )
      .mutation(async ({ input }) => {
        const projects = await loadProjects();
        const index = projects.findIndex((p) => p.id === input.id);

        if (index === -1) {
          throw new Error("Project not found");
        }

        projects[index] = {
          ...projects[index],
          name: input.name,
          description: input.description,
          icon: input.icon,
          link: input.link,
          updatedAt: Date.now(),
        };

        await saveProjects(projects);
        return projects[index];
      }),

    deleteProject: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        const projects = await loadProjects();
        const filtered = projects.filter((p) => p.id !== input.id);

        if (filtered.length === projects.length) {
          throw new Error("Project not found");
        }

        await saveProjects(filtered);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
