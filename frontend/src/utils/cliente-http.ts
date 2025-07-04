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
    const res = await fetch(url, options);

    if (res.status === 401) {
    // Lanzar error personalizado para que el cliente detecte
    throw new Error("Unauthorized");
  }

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
