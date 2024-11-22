import NextAuth from "next-auth";
import { next_Options } from "./options";

const handler = NextAuth(next_Options);

export const GET = handler;
export const POST = handler;