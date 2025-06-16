import getHeadersGlobal from "./header-global";

export const feching = async (
  endPoint: string,
  cache: RequestCache = "no-cache",
  metodo: string,
  body: any = null
) => {
  const headers = getHeadersGlobal();
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${endPoint}`;

  const options: RequestInit = {
    method: metodo,
    cache,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    console.log("📤 Enviando request a:", url);
    console.log("📦 Body:", body);
    console.log("🧾 Headers:", headers);

    const res = await fetch(url, options);

    // ⚠️ Si la respuesta NO es 2xx, lanza error manualmente
    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Error del servidor:", res.status, errorText);
      throw new Error(`Error del servidor: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("❌ Error en feching():", error);
    throw error;
  }
};
