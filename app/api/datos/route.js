const API_URL = 'https://script.google.com/macros/s/AKfycbxPQ4NAALPlUbOgDfJv6vSZ8iHx8J0RMa9OUj3BYh5iS_fOrJxnEObUoo0PSK6OTJvh/exec';

export async function GET() {
  try {
    const res = await fetch(API_URL, {
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      return Response.json(
        { error: 'Error al conectar con Apps Script' },
        { status: 500 }
      );
    }

    const data = await res.json();

    return Response.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });

  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}