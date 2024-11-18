import { getSurvivorsReports } from "~/apis/survivor-api";

export async function GET() {
  try {
    const reportsPayload = await getSurvivorsReports();

    return Response.json(reportsPayload, { status: 200  });
  } catch (error) {
    console.error('Failed to get survivors reports', error);

    return Response.json(
      { error: 'An error ocurred while getting survivor reports' },
      { status: error?.status }
    );
  }
}