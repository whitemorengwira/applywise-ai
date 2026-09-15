import { NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";
import { withObservability } from "@/lib/observability/http";

async function handleGet() {
  const profile = repository.getProfile();
  const experiences = repository.getExperiences();
  const skills = repository.getSkills();
  const educations = repository.getEducations();

  return NextResponse.json({
    profile,
    experiences,
    skills,
    educations,
  });
}

async function handlePut(request: Request) {
  try {
    const body = await request.json();
    const updated = repository.updateProfile(body);
    return NextResponse.json({ success: true, profile: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}

export const GET = withObservability(handleGet, "/api/profile");
export const PUT = withObservability(handlePut, "/api/profile");
