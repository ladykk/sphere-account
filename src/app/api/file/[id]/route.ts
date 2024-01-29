import { DELETE_FILE, GET_FILE, PUT_FILE } from "@/server/modules/file/route";

// GET /api/storage/[id]
export const GET = GET_FILE;

// PUT /api/storage/[id]
export const PUT = PUT_FILE;

// DELETE /api/storage/[id]
export const DELETE = DELETE_FILE;
