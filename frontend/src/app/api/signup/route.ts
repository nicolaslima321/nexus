import { cookies } from 'next/headers';
import { createSurvivor } from "~/apis/survivor-api";

export async function POST(request: Request) {
  try {
    const survivorData = await request.json();

    const creationPayload = await createSurvivor(survivorData);

    const cookieStore = await cookies()

    cookieStore.set('accessToken', creationPayload.accessToken);

    return Response.json(creationPayload, { status: 200  });
  } catch (error) {
    console.error('Failed to perform account creation', error);

    if (error?.status === 422)
      return Response.json(
        { error: 'E-mail already in use!' },
        { status: 422 }
      );

    return Response.json(
      { error: 'An error ocurred while performing account creation' },
      { status: 500 }
    );
  }
}