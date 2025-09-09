
const getHeadersGlobal = (body?: any) => {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  let headers: Record<string, string> = {
    // "Content-Type": "application/json; charset=utf-8",
    "api-key": apiKey || "",
  };

  // Solo añadir Authorization si estamos en cliente y existe token
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  // Si NO es FormData, agregamos Content-Type JSON
  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json; charset=utf-8";
  }

  return headers;
};

export default getHeadersGlobal;

