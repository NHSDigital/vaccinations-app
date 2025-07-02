import useInactivityTimer, { ACTIVITY_EVENTS } from "@src/utils/auth/inactivity-timer";
import { renderHook } from "@testing-library/react";
import { act } from "react";

describe("inactivity-timer", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should set isIdle after 9 minutes of inactivity", async () => {
    const { result } = renderHook(() => useInactivityTimer());

    act(() => {
      jest.advanceTimersByTime(8 * 60 * 1000); // 8 minutes
    });
    expect(result.current.isIdle).toBe(false);

    act(() => {
      jest.advanceTimersByTime(1 * 60 * 1000); // 1 more minute
    });
    expect(result.current.isIdle).toBe(true);
    expect(result.current.isTimedOut).toBe(false);
  });

  it("should set isTimedOut after 10 minutes of inactivity", () => {
    const { result } = renderHook(() => useInactivityTimer());

    expect(result.current.isTimedOut).toBe(false);

    act(() => {
      jest.advanceTimersByTime(10 * 60 * 1000); // 10 minutes
    });

    expect(result.current.isTimedOut).toBe(true);
  });

  it.each(ACTIVITY_EVENTS)("should reset timers on %s activity", (event: string) => {
    const { result } = renderHook(() => useInactivityTimer());

    // Simulate some time passing so the warning is shown
    act(() => {
      jest.advanceTimersByTime(9 * 60 * 1000); // 9 minutes
    });
    expect(result.current.isIdle).toBe(true);

    // Simulate user activity to hide away warning
    act(() => {
      window.dispatchEvent(new Event(event));
    });
    expect(result.current.isIdle).toBe(false);

    // Advance time again
    act(() => {
      jest.advanceTimersByTime(2 * 60 * 1000); // 2 more minutes
    });

    // Should not show warning or logout yet
    expect(result.current.isIdle).toBe(false);
  });
});
