import { NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";
import { JobDiscoveryService } from "@/lib/services/job-discovery.service";
import { FreshnessService } from "@/lib/services/freshness.service";
import { withObservability } from "@/lib/observability/http";

async function handleGet(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || undefined;
  const remoteOnly = searchParams.get("remote") === "true";
  const forceRefresh = searchParams.get("refresh") === "true";

  try {
    const liveJobs = await JobDiscoveryService.getLiveJobs({
      query,
      remoteOnly,
      forceRefresh,
    });

    // Include any custom manual jobs ingested into repository
    const customJobs = repository
      .getJobs(query, remoteOnly)
      .filter((j) => j.source === "manual");
    const merged = [...customJobs, ...liveJobs];

    // Canonical deduplication
    const seen = new Set<string>();
    const deduplicated = merged.filter((j) => {
      const key = `${j.company.toLowerCase()}|${j.title.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Enforce Section 5 Staleness Filter: automatically remove stale vacancies (> 30 days)
    const freshJobs = FreshnessService.filterFreshJobs(deduplicated);

    return NextResponse.json({
      success: true,
      jobs: freshJobs,
      total: freshJobs.length,
      staleRemoved: deduplicated.length - freshJobs.length,
      timestamp: new Date().toISOString(),
    });
  } catch {
    const fallbackJobs = repository.getJobs(query, remoteOnly);
    return NextResponse.json({
      success: true,
      jobs: fallbackJobs,
      total: fallbackJobs.length,
      fallback: true,
    });
  }
}

async function handlePost(request: Request) {
  try {
    const body = await request.json();
    const newJob = repository.addJob(body);
    return NextResponse.json({ success: true, job: newJob }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}

export const GET = withObservability(handleGet, "/api/jobs");
export const POST = withObservability(handlePost, "/api/jobs");
