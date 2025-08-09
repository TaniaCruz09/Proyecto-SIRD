import getHeadersGlobal from "./header-global";

export const feching = async (
  endPoint: string,
  cache: RequestCache = "no-cache",
  method: string,
  body: any = null
) => {
  const headers = await getHeadersGlobal();
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${endPoint}`;

  const options: RequestInit = {
    method,
    cache,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get("content-type");
    const isJSON = contentType?.includes("application/json");
    const responseData = isJSON ? await res.json() : await res.text();

    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.href = '/auth/login?expired=true';
    }

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
