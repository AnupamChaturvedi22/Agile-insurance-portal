import { expect, test } from "vitest";

import { apiRequest, normalizeAdminProfile, saveAdminSession } from "../src/utils/api.js";

test("normalizeAdminProfile maps backend auth responses into a usable admin profile", () => {
  const profile = normalizeAdminProfile({
    id: "admin_123",
    fullName: "Asha Menon",
    email: "asha.admin@agileinsure.in",
    role: "Super Admin",
    profilePhoto: "https://example.com/photo.jpg",
  });

  expect(profile).toEqual({
    adminId: "admin_123",
    name: "Asha Menon",
    email: "asha.admin@agileinsure.in",
    role: "Super Admin",
    profilePhoto: "https://example.com/photo.jpg",
    initials: "AM",
    access: "Super Admin",
    password: "",
  });
});

test("saveAdminSession stores the admin token and profile in local storage", () => {
  const storage = new Map();
  const fakeLocalStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key),
  };

  globalThis.localStorage = fakeLocalStorage;

  saveAdminSession("token-123", {
    id: "admin_123",
    fullName: "Asha Menon",
    email: "asha.admin@agileinsure.in",
    role: "Super Admin",
  });

  expect(localStorage.getItem("agile_insurance_admin_token_v1")).toBe("token-123");
  expect(JSON.parse(localStorage.getItem("agile_insurance_admin_profile_v1"))).toEqual({
    adminId: "admin_123",
    name: "Asha Menon",
    email: "asha.admin@agileinsure.in",
    role: "Super Admin",
    profilePhoto: "",
    initials: "AM",
    access: "Super Admin",
    password: "",
  });
});

test("apiRequest falls back safely when the backend returns invalid JSON", async () => {
  const originalFetch = globalThis.fetch;
  const originalLocalStorage = globalThis.localStorage;

  globalThis.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  };

  globalThis.fetch = async () =>
    new Response("not valid json", {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  try {
    const payload = await apiRequest("/api/admin/dashboard");
    expect(payload).toEqual({ message: "not valid json" });
  } finally {
    globalThis.fetch = originalFetch;
    globalThis.localStorage = originalLocalStorage;
  }
});
