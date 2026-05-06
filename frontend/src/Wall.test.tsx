import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import Wall from "./Wall";

/* mock fetch */
(globalThis as any).fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
  })
);

test("render หน้าได้", async () => {
  render(<Wall />);

  expect(
    await screen.findByText("ส่งกำลังใจให้โลก")
  ).toBeInTheDocument();
});
