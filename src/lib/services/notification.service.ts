/**
 * ApplyWise AI — Central Notification Service & Real-Time Notification Agent
 *
 * Coordinates 24/7 vacancy discovery notifications, application proofs, and
 * audio speech synthesis for the notification reader agent.
 */

export interface SystemNotification {
  id: string;
  type: "NEW_JOB" | "APPLICATION_SUBMITTED" | "SYSTEM_ALERT" | "INTERVIEW_UPDATE";
  title: string;
  message: string;
  company?: string;
  location?: string;
  salaryFormatted?: string;
  portalSource?: string;
  applyUrl?: string;
  isRead: boolean;
  timestamp: string;
  timeAgo: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  speechText: string;
}

const STORAGE_KEY = "applywise_notifications_v1";

const SEED_NOTIFICATIONS: SystemNotification[] = [
  {
    id: "notif-job-entelect",
    type: "NEW_JOB",
    title: "Lead Solutions & Cloud Architect",
    company: "Entelect South Africa",
    location: "Johannesburg, South Africa (Hybrid)",
    salaryFormatted: "R110,000 – R145,000 / month (ZAR)",
    portalSource: "PNet South Africa",
    applyUrl: "https://www.pnet.co.za/jobs/lead-solutions-architect-entelect",
    isRead: false,
    timestamp: new Date(Date.now() - 1000 * 45).toISOString(), // 45s ago
    timeAgo: "Just now",
    priority: "HIGH",
    speechText:
      "New Tier 1 vacancy posted just now by Entelect South Africa on PNet: Lead Solutions and Cloud Architect in Johannesburg. Salary up to 145,000 Rands per month. Fit score: 98 percent.",
    message: "Freshly posted high-yield role matched against Master CV with 98% architectural alignment.",
  },
  {
    id: "notif-job-iqbusiness",
    type: "NEW_JOB",
    title: "AI & Generative Systems Architect",
    company: "IQbusiness",
    location: "Sandton, South Africa (Hybrid)",
    salaryFormatted: "R120,000 – R150,000 / month (ZAR)",
    portalSource: "LinkedIn Easy Apply",
    applyUrl: "https://www.linkedin.com/jobs/view/ai-architect-iqbusiness",
    isRead: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(), // 3m ago
    timeAgo: "3m ago",
    priority: "HIGH",
    speechText:
      "Fresh vacancy on LinkedIn Easy Apply: IQbusiness is hiring an AI and Generative Systems Architect in Sandton. Salary 120,000 to 150,000 Rands. Fit score: 96 percent.",
    message: "Enterprise AWS Bedrock and pgvector RAG delivery. 1-click in-app Easy Apply ready.",
  },
  {
    id: "notif-job-econet",
    type: "NEW_JOB",
    title: "Principal Cloud Telecoms Architect",
    company: "Econet Wireless",
    location: "Harare, Zimbabwe / Remote",
    salaryFormatted: "$120,000 – $155,000 / year (USD)",
    portalSource: "Indeed Quick Apply",
    applyUrl: "https://www.indeed.com/viewjob?jk=econet-cloud-architect",
    isRead: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(), // 12m ago
    timeAgo: "12m ago",
    priority: "HIGH",
    speechText:
      "New regional vacancy on Indeed Quick Apply: Econet Wireless is seeking a Principal Cloud Telecoms Architect in Harare, offering up to 155,000 US Dollars per year. Fit score: 94 percent.",
    message: "High-yield USD compensation role in Zimbabwe. Distributed billing and microservices.",
  },
  {
    id: "notif-job-synthesia",
    type: "NEW_JOB",
    title: "Staff Distributed Systems Architect",
    company: "Synthesia",
    location: "Global Remote (African Candidates Eligible)",
    salaryFormatted: "$140,000 – $180,000 / year (USD)",
    portalSource: "Remotive (100% Free Portal)",
    applyUrl: "https://remotive.com/remote-jobs/software-dev/staff-systems-architect",
    isRead: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25m ago
    timeAgo: "25m ago",
    priority: "MEDIUM",
    speechText:
      "Global remote alert on Remotive: Synthesia is recruiting a Staff Distributed Systems Architect. Open to African candidates. Salary up to 180,000 US Dollars.",
    message: "Global AI video platform infrastructure role accepting African applicants. Verified 100% free portal.",
  },
  {
    id: "notif-app-proof-za",
    type: "APPLICATION_SUBMITTED",
    title: "Application Dispatched — Entelect SA",
    company: "Entelect South Africa",
    location: "South Africa",
    portalSource: "PNet Connector MCP",
    isRead: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    timeAgo: "2h ago",
    priority: "MEDIUM",
    speechText:
      "Application submitted to Entelect South Africa via PNet Connector. Master CV SHA-256 verified and logged in permanent audit ledger.",
    message: "Cryptographic proof PROOF-AW-ZA-ENT-01 generated. Zero CV mutation verified.",
  },
];

type NotificationListener = (notifications: SystemNotification[]) => void;

export class NotificationService {
  private static listeners: Set<NotificationListener> = new Set();
  private static inMemoryStore: SystemNotification[] | null = null;

  /**
   * Retrieve all notifications, merging localStorage with defaults
   */
  public static getNotifications(): SystemNotification[] {
    if (typeof window === "undefined") {
      return this.inMemoryStore ? [...this.inMemoryStore] : [...SEED_NOTIFICATIONS];
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // fallback to seed
    }
    return [...SEED_NOTIFICATIONS];
  }

  public static resetToDefaults(): void {
    this.persist([...SEED_NOTIFICATIONS]);
  }

  /**
   * Save notifications to storage and notify listeners
   */
  private static persist(notifications: SystemNotification[]): void {
    this.inMemoryStore = [...notifications];
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
      } catch {
        // quota handled
      }
    }
    this.notifyListeners(notifications);
  }

  public static subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private static notifyListeners(notifications: SystemNotification[]): void {
    for (const listener of this.listeners) {
      listener(notifications);
    }
  }

  /**
   * Get total unread count
   */
  public static getUnreadCount(): number {
    return this.getNotifications().filter((n) => !n.isRead).length;
  }

  /**
   * Mark a single notification as read
   */
  public static markAsRead(id: string): void {
    const list = this.getNotifications();
    const updated = list.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    this.persist(updated);
  }

  /**
   * Mark all notifications as read
   */
  public static markAllAsRead(): void {
    const list = this.getNotifications();
    const updated = list.map((n) => ({ ...n, isRead: true }));
    this.persist(updated);
  }

  /**
   * Add a new incoming job or alert notification
   */
  public static addNotification(item: Omit<SystemNotification, "id" | "isRead" | "timestamp" | "timeAgo">): SystemNotification {
    const list = this.getNotifications();
    const newNotif: SystemNotification = {
      ...item,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      isRead: false,
      timestamp: new Date().toISOString(),
      timeAgo: "Just now",
    };
    const updated = [newNotif, ...list.slice(0, 49)];
    this.persist(updated);
    return newNotif;
  }

  /**
   * Clear all notifications
   */
  public static clearAll(): void {
    this.persist([]);
  }

  /**
   * Dedicated Notification Voice Reader Agent
   * Synthesizes audio speech to read out recent job notifications aloud.
   */
  public static readNotificationAloud(id?: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        resolve(false);
        return;
      }

      window.speechSynthesis.cancel(); // Stop any currently playing audio

      const list = this.getNotifications();
      let textToSpeak = "";

      if (id) {
        const item = list.find((n) => n.id === id);
        if (item) textToSpeak = item.speechText || item.message;
      } else {
        const unread = list.filter((n) => !n.isRead);
        const targetList = unread.length > 0 ? unread.slice(0, 3) : list.slice(0, 2);
        const intro = `ApplyWise AI Notification Agent. You have ${unread.length} new notifications. `;
        const itemsText = targetList.map((n, i) => `Alert ${i + 1}: ${n.speechText}`).join(" ");
        textToSpeak = intro + itemsText;
      }

      if (!textToSpeak) {
        resolve(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 1.05; // clear natural executive cadence
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Select an English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice =
        voices.find((v) => v.lang === "en-GB") ||
        voices.find((v) => v.lang.startsWith("en-")) ||
        voices[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => resolve(true);
      utterance.onerror = () => resolve(false);

      window.speechSynthesis.speak(utterance);
    });
  }

  /**
   * Stop speech output
   */
  public static stopReading(): void {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }
}
