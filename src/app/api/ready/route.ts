// =============================================================================
// ApplyWise AI — Kubernetes Readiness Probe (/api/ready)
// Determines whether the container is ready to accept production traffic
// =============================================================================

import { NextResponse } from 'next/server';
import { repository } from '@/lib/db/repository';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();

  try {
    // 1. Verify in-memory / database repository is accessible
    const profile = await repository.getProfile();
    const isProfileReady = !!profile;

    // 2. Verify process memory limits (ensure heap is not exhausted)
    const memoryUsage = process.memoryUsage();
    const heapUsedMb = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const heapTotalMb = Math.round(memoryUsage.heapTotal / 1024 / 1024);

    // If heap used exceeds 95% of total allocated heap, mark as not ready
    const isMemoryHealthy = heapTotalMb === 0 || heapUsedMb / heapTotalMb < 0.95;

    const isReady = isProfileReady && isMemoryHealthy;

    const responsePayload = {
      status: isReady ? 'READY' : 'NOT_READY',
      checks: {
        profileData: isProfileReady ? 'OK' : 'MISSING',
        memory: isMemoryHealthy ? 'OK' : 'HIGH_UTILIZATION',
        heapUsedMb,
        heapTotalMb,
      },
      durationMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };

    if (!isReady) {
      return NextResponse.json(responsePayload, { status: 503 });
    }

    return NextResponse.json(responsePayload, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    const errorDetails = error instanceof Error ? error.message : 'Unknown readiness check failure';
    return NextResponse.json(
      {
        status: 'NOT_READY',
        error: errorDetails,
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
