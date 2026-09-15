import { NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";

export async function GET() {
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

export async function PUT(request: Request) {
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
