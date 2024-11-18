import { createSurvivor, fetchSurvivors } from "~/apis/survivor-api";

export async function GET() {
  try {
    const survivorsPayload = await fetchSurvivors();

    return Response.json(survivorsPayload, { status: 200  });
  } catch (error) {
    console.error('Failed to fetch survivors', error);

    return Response.json(
      { error: 'An error ocurred while fetching survivors' },
      { status: error?.status }
    );
  }
}

export async function POST(request: Request) {
  try {
    const survivorData = await request.json();

    const creationPayload = await createSurvivor(survivorData);

    return Response.json(creationPayload, { status: 200  });
  } catch (error) {
    console.error('Failed to perform survivor creation', error);

    return Response.json(
      { error: 'An error ocurred while performing survivor creation' },
      { status: 500 }
    );
  }
}