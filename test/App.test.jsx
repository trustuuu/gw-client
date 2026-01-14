import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "../src/App";

// Mock Layout to avoid deep rendering and side effects
vi.mock("../src/pages/Layout", () => ({
  default: () => <div>Mocked Layout for testing</div>,
}));

// Mock AuthContext to avoid API calls and initialization
vi.mock("../src/component/AuthContext", () => ({
  AuthContextProvider: ({ children }) => <div>{children}</div>,
  useAuth: vi.fn(), 
}));

describe("App", () => {
  it("renders Layout", () => {
    render(<App />);
    expect(screen.getByText("Mocked Layout for testing")).toBeInTheDocument();
  });
});
