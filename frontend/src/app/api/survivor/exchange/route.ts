import { exchangeItems } from "~/apis/survivor-api";

export async function POST(request: Request) {
  const exchangeData = await request.json();

  try {
    const exchangePayload = await exchangeItems(exchangeData);

    return Response.json(exchangePayload, { status: 200 });
  } catch (error) {
    console.error("Failed to perform item exchange", error);

    return Response.json(
      { error: "An error ocurred while performing item exchange" },
      { status: error.status },
    );
  }
}
