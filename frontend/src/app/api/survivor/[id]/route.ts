import { getSurvivor } from "~/apis/survivor-api";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const survivor = await getSurvivor(id);

    return Response.json(survivor, { status: 200 });
  } catch (error) {
    console.error("Failed to perform survivor fetch", error);

    return Response.json(
      { error: "An error ocurred while performing survivor fetch" },
      { status: error.status },
    );
  }
}
