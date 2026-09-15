import { NextResponse } from "next/server";
import { RAGService } from "@/lib/services/rag.service";

export async function POST(request: Request) {
  try {
    const { question } = await request.json();
    if (!question || question.trim() === "") {
      return NextResponse.json({ error: "Question parameter is required" }, { status: 400 });
    }

    const result = await RAGService.queryCopilot(question);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
