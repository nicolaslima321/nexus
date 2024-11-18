import { addItemOnInventory } from "~/apis/survivor-api";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const itemData = await request.json();

  try {
    const payload = await addItemOnInventory(id, itemData);

    return Response.json(payload, { status: 200 });
  } catch (error) {
    console.error("Failed to perform inventory addition", error);

    return Response.json(
      { error: "An error ocurred while performing inventory addition" },
      { status: error.status },
    );
  }
}
