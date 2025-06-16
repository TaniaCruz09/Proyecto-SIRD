"use server";

const getHeadersGlobal = () => {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "api-key": apiKey || "",
  };

  return headers;
};

export default getHeadersGlobal;

