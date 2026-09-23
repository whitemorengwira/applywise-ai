// =============================================================================
// ApplyWise AI — Prometheus Metrics Scraping Endpoint (/api/metrics)
// Exposes standard Prometheus text-based telemetry format
// =============================================================================

import {
  registry,
  campaignTargetTotal,
  campaignSubmittedTotal,
  campaignRemainingTotal,
  campaignBatchSize,
} from '@/lib/observability/metrics';
import { CampaignService } from '@/lib/services/campaign.service';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const summary = await CampaignService.getActiveCampaignSummary();
    campaignTargetTotal.set(summary.targetApplications);
    campaignSubmittedTotal.set(summary.submittedCount);
    campaignRemainingTotal.set(summary.remainingCount);
    campaignBatchSize.set(summary.batchSize);

    const metricsData = await registry.metrics();
    return new NextResponse(metricsData, {
      status: 200,
      headers: {
        'Content-Type': registry.contentType,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown metrics scrape failure';
    return new NextResponse(`# Error collecting Prometheus metrics: ${errorMessage}\n`, {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}
