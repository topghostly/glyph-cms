import { NextRequest, NextResponse } from "next/server";

export function setCorsHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*"); // or restrict to specific origin
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization"
  );

  return response;
}

// (Optional) You can create a handler for OPTIONS preflight if needed:
export async function handleOptionsRequest(request: NextRequest) {
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 });
    return setCorsHeaders(response);
  }
}
