"use server";
import { getServerSession } from "next-auth";
import { authOptions } from ".";

export const getServerAuthSession = getServerSession(authOptions);
