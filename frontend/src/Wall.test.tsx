import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { test, expect, vi, beforeEach, afterEach } from "vitest";
import Wall from "./Wall";

/* mock fetch */
beforeEach(() => {
  (globalThis as any).fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([]),
    })
  );
});

afterEach(() => {
  vi.resetAllMocks();
});

test("render หน้าได้", async () => {
  render(<Wall />);

  expect(
    await screen.findByText("ส่งกำลังใจให้โลก")
  ).toBeInTheDocument();
});

test("ปุ่ม disabled ตอนยังไม่พิมพ์", async () => {
  render(<Wall />);

  // ❗ แก้ตรงนี้: ใช้ role แทน text
  const button = await screen.findByRole("button", {
    name: /ส่งออกไป/i,
  });

  expect(button).toBeDisabled();
});
