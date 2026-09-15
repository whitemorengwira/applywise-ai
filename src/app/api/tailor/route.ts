import { NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";
import { TailorService } from "@/lib/services/tailor.service";

export async function POST(request: Request) {
  try {
    const { jobId, applicationId, type = "cv" } = await request.json();

    if (!jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    }

    const job = repository.getJobById(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job listing not found" }, { status: 404 });
    }

    const profile = repository.getProfile();
    const experiences = repository.getExperiences();
    const appId = applicationId || `app-temp-${Date.now()}`;

    if (type === "cover_letter") {
      const result = await TailorService.generateCoverLetter(appId, job, profile, experiences);
      return NextResponse.json({ success: true, result });
    }

    const result = await TailorService.tailorCV(appId, job, profile, experiences);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
