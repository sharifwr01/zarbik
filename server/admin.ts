import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import type { Project, ProjectsData } from "@shared/types";

const PROJECTS_FILE = path.join(process.cwd(), "data", "projects.json");
const ADMIN_FILE = path.join(process.cwd(), "data", "admin.json");

/**
 * Hash password using PBKDF2
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verify password against hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  const [salt, storedHash] = hash.split(":");
  if (!salt || !storedHash) return false;

  const computedHash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");

  return computedHash === storedHash;
}

/**
 * Ensure data directory exists
 */
async function ensureDataDir(): Promise<void> {
  const dataDir = path.dirname(PROJECTS_FILE);
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    console.error("Failed to create data directory:", error);
  }
}

/**
 * Load projects from JSON file
 */
export async function loadProjects(): Promise<Project[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(PROJECTS_FILE, "utf-8");
    const parsed: ProjectsData = JSON.parse(data);
    return parsed.projects || [];
  } catch (error) {
    // File doesn't exist or is invalid, return empty array
    return [];
  }
}

/**
 * Save projects to JSON file
 */
export async function saveProjects(projects: Project[]): Promise<void> {
  try {
    await ensureDataDir();
    const data: ProjectsData = {
      projects,
      lastUpdated: Date.now(),
    };
    await fs.writeFile(PROJECTS_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to save projects:", error);
    throw error;
  }
}

/**
 * Admin data structure
 */
interface AdminData {
  username: string;
  email: string;
  passwordHash: string;
  createdAt: number;
}

/**
 * Check if admin account exists
 */
export async function adminExists(): Promise<boolean> {
  try {
    await fs.access(ADMIN_FILE);
    return true;
  } catch {
    return false;
  }
}

/**
 * Create admin account (first-time setup)
 */
export async function createAdmin(
  username: string,
  email: string,
  password: string
): Promise<void> {
  if (await adminExists()) {
    throw new Error("Admin account already exists");
  }

  try {
    await ensureDataDir();
    const admin: AdminData = {
      username,
      email,
      passwordHash: hashPassword(password),
      createdAt: Date.now(),
    };
    await fs.writeFile(ADMIN_FILE, JSON.stringify(admin, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to create admin account:", error);
    throw error;
  }
}

/**
 * Get admin account
 */
export async function getAdmin(): Promise<AdminData | null> {
  try {
    const data = await fs.readFile(ADMIN_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * Verify admin credentials
 */
export async function verifyAdmin(
  username: string,
  password: string
): Promise<boolean> {
  const admin = await getAdmin();
  if (!admin) return false;

  return admin.username === username && verifyPassword(password, admin.passwordHash);
}

/**
 * Generate session token
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Verify session token (in production, use JWT)
 */
export function createSessionToken(adminId: string): string {
  // For simplicity, using a basic token. In production, use JWT with expiration
  const token = crypto.randomBytes(32).toString("hex");
  return token;
}
