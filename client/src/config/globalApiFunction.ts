import apiRequestGlobal from "./axios.config";

interface GetRequest {
  url: string;
  searchParams?: Record<string, string | number | boolean>;
  signal?: AbortSignal;
}

const handleGlobalGetRequestQuery = <TResponse>({ url, searchParams = {}, signal }: GetRequest) =>
  apiRequestGlobal.get<TResponse>(url, { params: searchParams, signal }).then((response) => response.data);

export { handleGlobalGetRequestQuery };