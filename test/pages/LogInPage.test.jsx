import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LogInPage from "../../src/pages/LogInPage";
import * as AuthContext from "../../src/component/AuthContext";
import * as ReactCookie from "react-cookie";
import * as Router from "react-router-dom";
import * as Utils from "../../src/utils/Utils";
import { authServer, client } from "../../src/api/igw-api";

// Mock dependencies
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock("react-cookie", () => ({
  useCookies: vi.fn(),
}));

vi.mock("../../src/component/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../src/utils/Utils", () => ({
  generateCodeVerifier: vi.fn(),
  generateCodeChallenge: vi.fn(),
}));

describe("LogInPage", () => {
  const mockNavigate = vi.fn();
  const mockSetCookie = vi.fn();
  const mockRemoveCookie = vi.fn();
  const mockSaveCodeVerifier = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mocks
    vi.mocked(Router.useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(ReactCookie.useCookies).mockReturnValue([{}, mockSetCookie, mockRemoveCookie]);
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      saveCodeVerifier: mockSaveCodeVerifier,
    });
    vi.mocked(Utils.generateCodeVerifier).mockReturnValue("mock-verifier");
    vi.mocked(Utils.generateCodeChallenge).mockResolvedValue("mock-challenge");
  });

  it("renders login form with all fields", () => {
    render(
      <Router.MemoryRouter>
        <LogInPage />
      </Router.MemoryRouter>
    );

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account yet/i)).toBeInTheDocument();
    expect(screen.getByText(/signup/i)).toBeInTheDocument();
  });

  it("updates input fields on change", () => {
    render(
      <Router.MemoryRouter>
        <LogInPage />
      </Router.MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  it("calls saveCodeVerifier and generateCodeChallenge on mount", () => {
    render(
      <Router.MemoryRouter>
        <LogInPage />
      </Router.MemoryRouter>
    );

    expect(Utils.generateCodeVerifier).toHaveBeenCalled();
    expect(mockSaveCodeVerifier).toHaveBeenCalledWith("mock-verifier");
    expect(Utils.generateCodeChallenge).toHaveBeenCalledWith("mock-verifier");
  });

  it("sets cookies on form submit", () => {
    render(
      <Router.MemoryRouter>
        <LogInPage />
      </Router.MemoryRouter>
    );

    const form = screen.getByRole("button", { name: /login/i }).closest("form");
    fireEvent.submit(form);

    expect(mockSetCookie).toHaveBeenCalledWith(
      "IsRemember",
      false,
      expect.objectContaining({
        Secure: true,
        SameSite: "Strict",
      })
    );
  });

  it("has correct form attributes", () => {
    render(
      <Router.MemoryRouter>
        <LogInPage />
      </Router.MemoryRouter>
    );

    const form = screen.getByRole("button", { name: /login/i }).closest("form");
    
    // Check if the action attribute matches authServer.authLogin
    // Note: getAttribute might return a relative or absolute path depending on jsdom setup
    // but here we just check if it's set.
    expect(form).toHaveAttribute("method", "POST");
    expect(form).toHaveAttribute("action", authServer.authLogin);
    
    // Check hidden inputs
    expect(screen.getByDisplayValue(client.client_id)).toBeInTheDocument();
    expect(screen.getByDisplayValue(client.scope)).toBeInTheDocument();
    expect(screen.getByDisplayValue(client.state)).toBeInTheDocument();
  });

  it("redirects if token is valid (integration simulation)", () => {
    // Mock cookie with valid token
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const validToken = {
        data: {
            expires_in: Math.floor(futureDate.getTime() / 1000)
        }
    };

    vi.mocked(ReactCookie.useCookies).mockReturnValue([{ tokenJson: validToken }, mockSetCookie, mockRemoveCookie]);

    render(
      <Router.MemoryRouter>
        <LogInPage />
      </Router.MemoryRouter>
    );

    // In the component, there is logic:
    // const expires_in = Math.floor(cookies.tokenJson.data.expires_in) < Math.floor(now_utc / 1000);
    // if (!expires_in) { navigate("/callback"); }
    // Note: The logic in component seems to define `expires_in` boolean as "is expired?".
    // Let's re-read the component code carefully.
    // Math.floor(cookies.tokenJson.data.expires_in) < Math.floor(now_utc / 1000);
    // if token_expire_time < current_time, then it IS expired.
    // So `expires_in` variable means `isExpired`.
    // if (!isExpired) -> navigate("/callback"). (Wait, if NOT expired, go to callback? Usually callback is for after login. Maybe it means "already logged in, go to callback/dashboard"?)
    // Yes, if token is valid, redirect.

    expect(mockNavigate).toHaveBeenCalledWith("/callback");
  });
});
