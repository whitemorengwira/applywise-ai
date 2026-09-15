import { NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || undefined;
  const remoteOnly = searchParams.get("remote") === "true";

  const jobs = repository.getJobs(query, remoteOnly);
  return NextResponse.json({ jobs, total: jobs.length });
}

export async function POST(request: Request) {
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
