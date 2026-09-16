import { NextResponse } from "next/server";
import { RAGService } from "@/lib/services/rag.service";
import { withObservability } from "@/lib/observability/http";

async function handlePost(request: Request) {
  try {
    const { question } = await request.json();
    if (!question || question.trim() === "") {
      return NextResponse.json({ error: "Question parameter is required" }, { status: 400 });
    }

    const result = await RAGService.queryCopilot(question);
    const isGrounded = result.citedChunks.length > 0;
    return NextResponse.json({ success: true, result, isGrounded });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export const POST = withObservability(handlePost, "/api/rag");
