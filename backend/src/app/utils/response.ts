type MetaResponse = {
  message: string;
  status: number;
  data: any;
};

export function successResponse(message: string, data: any, status = 200): MetaResponse {
  return {
    message,
    status,
    data,
  };
}

export function errorResponse(message: string, status = 400, data: any = null): MetaResponse {
  return {
    message,
    status,
    data,
  };
}
