import { NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";
import { withObservability } from "@/lib/observability/http";

async function handleGet(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || undefined;
  const remoteOnly = searchParams.get("remote") === "true";

  const jobs = repository.getJobs(query, remoteOnly);
  return NextResponse.json({ jobs, total: jobs.length });
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
