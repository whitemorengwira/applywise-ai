# ApplyWise AI — UI Registry

## Component Registry

This document tracks all reusable UI components and their implementation status.

### Base Components (shadcn/ui)

| Component | Status | Path | Notes |
|---|---|---|---|
| Button | [ ] | `components/ui/button.tsx` | Primary, secondary, ghost, destructive variants |
| Input | [ ] | `components/ui/input.tsx` | Standard text input |
| Textarea | [ ] | `components/ui/textarea.tsx` | Multi-line input |
| Card | [ ] | `components/ui/card.tsx` | CardHeader, CardTitle, CardDescription, CardContent, CardFooter |
| Badge | [ ] | `components/ui/badge.tsx` | Status badges, skill tags |
| Table | [ ] | `components/ui/table.tsx` | Data tables |
| Dialog | [ ] | `components/ui/dialog.tsx` | Modal dialogs |
| Sheet | [ ] | `components/ui/sheet.tsx` | Slide-over panels (mobile nav) |
| Tabs | [ ] | `components/ui/tabs.tsx` | Tab navigation |
| Select | [ ] | `components/ui/select.tsx` | Dropdown select |
| Avatar | [ ] | `components/ui/avatar.tsx` | User avatars |
| Dropdown Menu | [ ] | `components/ui/dropdown-menu.tsx` | Context menus |
| Tooltip | [ ] | `components/ui/tooltip.tsx` | Hover tooltips |
| Progress | [ ] | `components/ui/progress.tsx` | Progress bars |
| Skeleton | [ ] | `components/ui/skeleton.tsx` | Loading skeletons |
| Separator | [ ] | `components/ui/separator.tsx` | Dividers |
| Label | [ ] | `components/ui/label.tsx` | Form labels |
| Form | [ ] | `components/ui/form.tsx` | react-hook-form integration |
| Toast | [ ] | `components/ui/toast.tsx` | Notifications (via sonner) |
| Scroll Area | [ ] | `components/ui/scroll-area.tsx` | Custom scroll containers |

### Layout Components (Custom)

| Component | Status | Path | Props |
|---|---|---|---|
| AppSidebar | [ ] | `components/layout/app-sidebar.tsx` | `collapsed: boolean` |
| Header | [ ] | `components/layout/header.tsx` | `title: string, breadcrumbs?: Breadcrumb[]` |
| PageContainer | [ ] | `components/layout/page-container.tsx` | `children, title, description, actions` |
| DashboardShell | [ ] | `components/layout/dashboard-shell.tsx` | Sidebar + main content wrapper |

### Feature Components (Custom)

| Component | Status | Path | Purpose |
|---|---|---|---|
| MatchScoreRing | [ ] | `components/jobs/match-score-ring.tsx` | Circular match score display |
| MatchBreakdown | [ ] | `components/jobs/match-breakdown.tsx` | Score category breakdown |
| JobCard | [ ] | `components/jobs/job-card.tsx` | Job listing card |
| JobFilters | [ ] | `components/jobs/job-filters.tsx` | Search filters panel |
| ApplicationTimeline | [ ] | `components/applications/application-timeline.tsx` | Status change timeline |
| ApplicationKanban | [ ] | `components/applications/application-kanban.tsx` | Kanban board view |
| ProfileCompleteness | [ ] | `components/profile/profile-completeness.tsx` | Profile completion indicator |
| ExperienceCard | [ ] | `components/profile/experience-card.tsx` | Experience entry display |
| SkillTag | [ ] | `components/profile/skill-tag.tsx` | Skill badge with proficiency |
| AIStreamingMessage | [ ] | `components/ai/streaming-message.tsx` | Streaming AI response |
| AIChatMessage | [ ] | `components/ai/chat-message.tsx` | Chat bubble |
| AIChatInput | [ ] | `components/ai/chat-input.tsx` | Chat input with send |
| AISourceCitation | [ ] | `components/ai/source-citation.tsx` | RAG source attribution |
| AIAnalysisCard | [ ] | `components/ai/analysis-card.tsx` | AI analysis result display |
| StatsCard | [ ] | `components/dashboard/stats-card.tsx` | Metric card with icon |
| RecentActivity | [ ] | `components/dashboard/recent-activity.tsx` | Activity feed |
| UpcomingInterviews | [ ] | `components/dashboard/upcoming-interviews.tsx` | Interview schedule |
| EmptyState | [ ] | `components/ui/empty-state.tsx` | Empty state with CTA |
| LoadingState | [ ] | `components/ui/loading-state.tsx` | Page-level loading |
| ErrorState | [ ] | `components/ui/error-state.tsx` | Error with retry |

Components are registered here when designed, updated to `[x]` when implemented.
