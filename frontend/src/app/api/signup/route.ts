import { performCreation } from "~/apis/account-api";

export async function POST(request: Request) {
  try {
    const survivorData = await request.json();

    console.log('survivorData');
    console.log(survivorData);

    const creationPayload = await performCreation(survivorData);

    // const cookieStore = await cookies()

    // cookieStore.set('accessToken', accessToken);

    return Response.json(creationPayload, { status: 200  });
  } catch (error) {
    console.error('Failed to perform account creation', error);

    return Response.json(
      { error: 'An error ocurred while performing account creation' },
      { status: 500 }
    );
  }
}