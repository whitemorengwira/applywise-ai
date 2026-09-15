import { NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";
import { MatchService } from "@/lib/services/match.service";
import { withObservability } from "@/lib/observability/http";

async function handlePost(request: Request) {
  try {
    const { jobId } = await request.json();
    if (!jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    }

    const job = repository.getJobById(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job listing not found" }, { status: 404 });
    }

    const profile = repository.getProfile();
    const skills = repository.getSkills();
    const experiences = repository.getExperiences();

    const analysis = await MatchService.evaluateMatch(job, profile, skills, experiences);
    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export const POST = withObservability(handlePost, "/api/match");
