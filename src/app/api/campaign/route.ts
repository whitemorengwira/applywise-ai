import { NextResponse } from "next/server";
import { CampaignService } from "@/lib/services/campaign.service";
import { withObservability } from "@/lib/observability/http";

export const dynamic = "force-dynamic";

async function handleGet(_request: Request) {
  void _request;
  try {
    const summary = await CampaignService.getActiveCampaignSummary();
    const campaign = await CampaignService.getActiveCampaign();
    const checkpoint = await CampaignService.getLatestCheckpoint(campaign.id);

    return NextResponse.json({
      success: true,
      summary,
      campaign,
      latestCheckpoint: checkpoint,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

async function handlePost(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const active = await CampaignService.getActiveCampaign();
    const updated = await CampaignService.updateCampaign(active.id, body);
    const summary = await CampaignService.getActiveCampaignSummary();

    return NextResponse.json({
      success: true,
      campaign: updated,
      summary,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export const GET = withObservability(handleGet, "/api/campaign");
export const POST = withObservability(handlePost, "/api/campaign");
