import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";

export const getSessionUser = async () => {
  const session = await getServerSession(authOptions);
  console.log("Server-side session:", session);

  if (!session || !session.user) {
    console.log("No session or user found");
    return null;
  }

  return {
    user: session.user,
    userId: session.user.id,
  };
};
