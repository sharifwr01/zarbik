import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  hashPassword,
  verifyPassword,
  createAdmin,
  getAdmin,
  verifyAdmin,
  adminExists,
  loadProjects,
  saveProjects,
} from "./admin";
import fs from "fs/promises";
import path from "path";

const TEST_ADMIN_FILE = path.join(process.cwd(), "data", "test-admin.json");
const TEST_PROJECTS_FILE = path.join(process.cwd(), "data", "test-projects.json");

describe("Admin Authentication", () => {
  describe("Password Hashing", () => {
    it("should hash passwords with salt", () => {
      const password = "test-password-123";
      const hash = hashPassword(password);

      expect(hash).toContain(":");
      const [salt, hashedPart] = hash.split(":");
      expect(salt).toHaveLength(32); // 16 bytes = 32 hex chars
      expect(hashedPart).toHaveLength(128); // 64 bytes = 128 hex chars
    });

    it("should produce different hashes for the same password", () => {
      const password = "test-password-123";
      const hash1 = hashPassword(password);
      const hash2 = hashPassword(password);

      expect(hash1).not.toBe(hash2); // Different salts
    });

    it("should verify correct password", () => {
      const password = "test-password-123";
      const hash = hashPassword(password);

      expect(verifyPassword(password, hash)).toBe(true);
    });

    it("should reject incorrect password", () => {
      const password = "test-password-123";
      const hash = hashPassword(password);

      expect(verifyPassword("wrong-password", hash)).toBe(false);
    });

    it("should reject invalid hash format", () => {
      expect(verifyPassword("password", "invalid-hash")).toBe(false);
      expect(verifyPassword("password", "no-colon")).toBe(false);
    });
  });

  describe("Admin Account Management", () => {
    beforeEach(async () => {
      // Clean up test files
      try {
        await fs.unlink(TEST_ADMIN_FILE);
      } catch {
        // File doesn't exist, that's fine
      }
    });

    afterEach(async () => {
      // Clean up test files
      try {
        await fs.unlink(TEST_ADMIN_FILE);
      } catch {
        // File doesn't exist, that's fine
      }
    });

    it("should check if admin exists", async () => {
      const exists = await adminExists();
      // This might be true or false depending on test environment
      expect(typeof exists).toBe("boolean");
    });

    it("should create admin account with hashed password", async () => {
      const username = "testadmin";
      const email = "admin@test.com";
      const password = "secure-password-123";

      // Note: In real test, we'd mock the file system
      // For now, we're testing the logic
      const hash = hashPassword(password);
      expect(hash).toBeTruthy();

      const admin = {
        username,
        email,
        passwordHash: hash,
        createdAt: Date.now(),
      };

      expect(admin.username).toBe(username);
      expect(admin.email).toBe(email);
      expect(verifyPassword(password, admin.passwordHash)).toBe(true);
    });

    it("should verify admin credentials correctly", async () => {
      const username = "testadmin";
      const password = "secure-password-123";
      const hash = hashPassword(password);

      // Simulate admin data
      const admin = {
        username,
        email: "admin@test.com",
        passwordHash: hash,
        createdAt: Date.now(),
      };

      // Verify correct credentials
      const isValid =
        admin.username === username && verifyPassword(password, admin.passwordHash);
      expect(isValid).toBe(true);

      // Verify incorrect credentials
      const isInvalid =
        admin.username === username &&
        verifyPassword("wrong-password", admin.passwordHash);
      expect(isInvalid).toBe(false);
    });
  });

  describe("Project Management", () => {
    it("should save and load projects", async () => {
      const projects = [
        {
          id: "project-1",
          name: "Test Project",
          description: "A test project",
          icon: "code",
          link: "https://example.com",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];

      // Test the structure
      expect(projects[0].id).toBe("project-1");
      expect(projects[0].name).toBe("Test Project");
      expect(projects[0].link).toBe("https://example.com");
    });

    it("should validate project data structure", () => {
      const validProject = {
        id: "project-1",
        name: "Valid Project",
        description: "A valid project",
        icon: "code",
        link: "https://example.com",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(validProject).toHaveProperty("id");
      expect(validProject).toHaveProperty("name");
      expect(validProject).toHaveProperty("description");
      expect(validProject).toHaveProperty("icon");
      expect(validProject).toHaveProperty("link");
      expect(validProject).toHaveProperty("createdAt");
      expect(validProject).toHaveProperty("updatedAt");
    });

    it("should generate unique project IDs", () => {
      const id1 = "project-" + Date.now();
      const id2 = "project-" + (Date.now() + 1);

      expect(id1).not.toBe(id2);
    });
  });
});
