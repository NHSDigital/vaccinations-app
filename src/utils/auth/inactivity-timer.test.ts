import { signOut } from 'next-auth/react';
import useInactivityTimer from "@src/utils/auth/inactivity-timer";
import { renderHook } from "@testing-library/react";
import { act } from "react";

jest.mock("next-auth/react", () => ({
  signOut: jest.fn(),
}));

describe("inactivity-timer", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllTimers();
    (signOut as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should show warning after 9 minutes of inactivity", async () => {
    const { result } = renderHook(() => useInactivityTimer());

    act(() => {
      jest.advanceTimersByTime(8 * 60 * 1000); // 8 minutes
    });
    expect(result.current.showWarning).toBe(false);

    act(() => {
      jest.advanceTimersByTime(1 * 60 * 1000); // 1 more minute
    });
    expect(result.current.showWarning).toBe(true);
  });

  it("should call signOut after 10 minutes of inactivity", () => {
    renderHook(() => useInactivityTimer());

    act(() => {
      jest.advanceTimersByTime(10 * 60 * 1000); // 10 minutes
    });

    expect(signOut).toHaveBeenCalled();
  });

  it("should reset timers on user activity", () => {
    const { result } = renderHook(() => useInactivityTimer());

    // Simulate some time passing so the warning is shown
    act(() => {
      jest.advanceTimersByTime(9 * 60 * 1000); // 9 minutes
    });
    expect(result.current.showWarning).toBe(true);

    // Simulate user activity to hide away warning
    act(() => {
      window.dispatchEvent(new Event("mousemove"));
    });
    expect(result.current.showWarning).toBe(false);

    // Advance time again
    act(() => {
      jest.advanceTimersByTime(2 * 60 * 1000); // 2 more minutes
    });

    // Should not show warning or logout yet
    expect(result.current.showWarning).toBe(false);
    expect(signOut).not.toHaveBeenCalled();
  });
});
