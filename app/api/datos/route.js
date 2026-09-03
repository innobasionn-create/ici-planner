const API_URL = 'https://script.google.com/macros/s/AKfycbwQIOL5ZfOiORFIvFlL9B2j6PJEdRhBDoPdHj-EiQa3RsgqPoJJfka35ZEJU3li937o/exec';

// Sin timeout, un fetch que se queda colgado (ej. firewall/antivirus
// bloqueando el handshake TLS con script.google.com) puede demorar minutos
// en fallar y romper el render de errores de Next. 12s es tiempo de sobra
// para que Apps Script responda en condiciones normales.
const TIMEOUT_MS = 12000;

export async function GET() {
  try {
    const res = await fetch(API_URL, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(TIMEOUT_MS),
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
    const timedOut = err.name === 'TimeoutError' || err.name === 'AbortError';
    console.error('Error al llamar Apps Script (datos):', err);
    return Response.json(
      {
        error: timedOut
          ? `No se pudo conectar con Google Apps Script en ${TIMEOUT_MS / 1000}s. Revisa tu conexión, VPN o antivirus (inspección SSL) que puedan estar bloqueando script.google.com.`
          : err.message,
      },
      { status: 500 }
    );
  }
}