import { describe, it, expect, beforeEach, vi } from "vitest";
import { NotificationService } from "@/lib/services/notification.service";

describe("Notification Service & Voice Reader Agent", () => {
  beforeEach(() => {
    // Reset to defaults before each test
    NotificationService.resetToDefaults();
  });

  it("initializes with default fresh free-tier job notifications", () => {
    const notifications = NotificationService.getNotifications();
    expect(notifications.length).toBeGreaterThanOrEqual(4);

    const portals = notifications.map((n) => n.portalSource).filter(Boolean);
    expect(portals.some((p) => p?.includes("PNet"))).toBe(true);
    expect(portals.some((p) => p?.includes("LinkedIn"))).toBe(true);
    expect(portals.some((p) => p?.includes("Indeed"))).toBe(true);
    expect(portals.some((p) => p?.includes("Remotive"))).toBe(true);
  });

  it("tracks unread notification count accurately", () => {
    const initialUnread = NotificationService.getUnreadCount();
    expect(initialUnread).toBeGreaterThan(0);

    const first = NotificationService.getNotifications().find((n) => !n.isRead);
    expect(first).toBeDefined();

    NotificationService.markAsRead(first!.id);
    expect(NotificationService.getUnreadCount()).toBe(initialUnread - 1);
  });

  it("adds new fresh job notifications and fires subscription listeners", () => {
    const listener = vi.fn();
    const unsubscribe = NotificationService.subscribe(listener);

    const newNotification = NotificationService.addNotification({
      title: "Fresh Job Discovered: Principal Cloud Architect",
      message: "Direct match at AWS Africa (Johannesburg, South Africa) via 100% Free Portal.",
      type: "NEW_JOB",
      company: "AWS South Africa",
      location: "Johannesburg, South Africa",
      salaryFormatted: "R130,000 / month",
      portalSource: "PNet South Africa",
      priority: "HIGH",
      speechText: "Fresh vacancy at AWS South Africa: Principal Cloud Architect.",
    });

    expect(newNotification.id).toBeTruthy();
    expect(newNotification.isRead).toBe(false);
    expect(listener).toHaveBeenCalled();

    const items = NotificationService.getNotifications();
    expect(items[0].id).toBe(newNotification.id);
    expect(items[0].title).toContain("Principal Cloud Architect");

    unsubscribe();
  });

  it("marks all notifications as read on demand", () => {
    NotificationService.markAllAsRead();
    expect(NotificationService.getUnreadCount()).toBe(0);

    for (const n of NotificationService.getNotifications()) {
      expect(n.isRead).toBe(true);
    }
  });

  it("supports voice reader narration text preparation without crashing", async () => {
    const notifications = NotificationService.getNotifications();
    expect(notifications.length).toBeGreaterThan(0);

    // Testing speech synthesis call gracefully handles headless/node environments
    const speechResult = await NotificationService.readNotificationAloud(notifications[0].id);
    expect(typeof speechResult).toBe("boolean");

    const allSpeechResult = await NotificationService.readNotificationAloud();
    expect(typeof allSpeechResult).toBe("boolean");
  });
});
