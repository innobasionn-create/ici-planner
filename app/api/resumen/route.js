// app/api/resumen/route.js
// Proxy server-side hacia Apps Script — sin CORS ni JSONP.
// Usa la misma variable APPS_SCRIPT_URL que ya tienes en Vercel.

const TIMEOUT_MS = 12000;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ramos = searchParams.get('ramos') || '';

  if (!process.env.APPS_SCRIPT_URL) {
    return Response.json(
      { ok: false, resumen: 'Variable APPS_SCRIPT_URL no configurada.', error: true },
      { status: 500 }
    );
  }

  const url = `${process.env.APPS_SCRIPT_URL}?action=resumen&ramos=${encodeURIComponent(ramos)}`;

  try {
    const res  = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(TIMEOUT_MS) });
    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    const timedOut = err.name === 'TimeoutError' || err.name === 'AbortError';
    console.error('Error al llamar Apps Script (resumen):', err);
    return Response.json(
      {
        ok: false,
        resumen: timedOut
          ? `No se pudo conectar con Google Apps Script en ${TIMEOUT_MS / 1000}s. Revisa tu conexión, VPN o antivirus (inspección SSL).`
          : 'No se pudo cargar el resumen. Intenta más tarde.',
        error: true,
      },
      { status: 500 }
    );
  }
}