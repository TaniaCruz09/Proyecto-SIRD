import getHeadersGlobal from "./header-global";

export const feching = async (
  endPoint: string,
  cache: RequestCache = "no-cache",
  method: string,
  body: any = null,
) => {
  // Detectamos si es FormData
  const isFormData = body instanceof FormData;
  const headers = await getHeadersGlobal(body);

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${endPoint}`;

  const options: RequestInit = {
    method,
    cache,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    credentials: 'include', // envía cookies en cada request
  };

  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get("content-type");
    const isJSON = contentType?.includes("application/json");
    const responseData = isJSON ? await res.json() : await res.text();

    if (!res.ok) {
      throw {
        response: {
          status: res.status,
          data: responseData,
        },
      }

    }

    return responseData;
  } catch (error) {
    console.error("❌ Error en feching():", error instanceof Error ? error.message : JSON.stringify(error));
    throw error;
  }
};
