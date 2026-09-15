import { NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";
import { withObservability } from "@/lib/observability/http";
import { applicationsCreatedTotal } from "@/lib/observability/metrics";

async function handleGet() {
  const applications = repository.getApplications();
  return NextResponse.json({ applications, total: applications.length });
}

async function handlePost(request: Request) {
  try {
    const { jobId } = await request.json();
    if (!jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    }

    const app = repository.createApplication(jobId);
    applicationsCreatedTotal.inc({ stage: 'draft' });
    return NextResponse.json({ success: true, application: app }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}

async function handlePatch(request: Request) {
  try {
    const { id, status, notes } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: "id and status are required" }, { status: 400 });
    }

    const updated = repository.updateApplicationStatus(id, status, notes);
    if (!updated) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, application: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}

export const GET = withObservability(handleGet, "/api/applications");
export const POST = withObservability(handlePost, "/api/applications");
export const PATCH = withObservability(handlePatch, "/api/applications");
