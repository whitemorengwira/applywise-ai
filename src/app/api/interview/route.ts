import { NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";
import { InterviewService } from "@/lib/services/interview.service";
import { withObservability } from "@/lib/observability/http";
import { interviewSessionsTotal } from "@/lib/observability/metrics";

async function handlePost(request: Request) {
  try {
    const { action, jobId, question, answer } = await request.json();

    if (action === "generate_questions") {
      const job = repository.getJobById(jobId) || repository.getJobs()[0];
      const profile = repository.getProfile();
      const questions = await InterviewService.generateQuestions(job, profile);
      interviewSessionsTotal.inc({ status: 'success' });
      return NextResponse.json({ success: true, questions });
    }

    if (action === "evaluate_answer") {
      if (!question || !answer) {
        return NextResponse.json({ error: "question and answer are required" }, { status: 400 });
      }
      const evaluation = await InterviewService.evaluateAnswer(question, answer);
      return NextResponse.json({ success: true, evaluation });
    }

    return NextResponse.json({ error: "Invalid action. Supported: generate_questions, evaluate_answer" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export const POST = withObservability(handlePost, "/api/interview");
