import { performLogin } from "~/apis/account-api";

import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const survivorLogin = await request.json();

    const { accessToken, survivorId, message } =
      await performLogin(survivorLogin);

    const cookieStore = await cookies();

    cookieStore.set("accessToken", accessToken);

    return Response.json({ survivorId, message }, { status: 200 });
  } catch (error) {
    if ([404, 401].includes(error?.status)) {
      return Response.json(
        { error: "Login or password is invalid" },
        { status: error.status },
      );
    }

    console.error("Failed to perform login", error);

    return Response.json(
      { error: "An error ocurred while performing login" },
      { status: 500 },
    );
  }
}
