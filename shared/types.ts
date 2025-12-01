/**
 * Unified type exports
 * Import shared types from this single entry point.
 */

export type * from "../drizzle/schema";
export * from "./_core/errors";

/**
 * Shared types for Zarbik project management
 */

export interface Project {
  id: string;
  name: string;
  description: string;
  icon: string; // Icon name or SVG content
  link: string;
  createdAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
}

export interface ProjectsData {
  projects: Project[];
  lastUpdated: number;
}

export interface AdminSetupPayload {
  username: string;
  email: string;
  password: string;
}

export interface AdminLoginPayload {
  username: string;
  password: string;
}

export interface AdminSession {
  adminId: string;
  username: string;
  email: string;
  isLoggedIn: boolean;
}
