"use client";

import { useState, useEffect } from "react";
import { account, databases } from "@/lib/appwrite";
import { Models, Query } from "appwrite";

// Combine Auth user and Profile document into one type
export interface UserSession extends Models.User<Models.Preferences> {
  fullName?: string;
  role?: string;
  firmId?: string;
}

export const useUser = () => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const loggedInUser = await account.get();

        const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
        const collectionId =
          process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;

        const profile = await databases.listDocuments(
          databaseId,
          collectionId,
          [Query.equal("userId", loggedInUser.$id)]
        );

        if (profile.documents.length > 0) {
          const userProfile = profile.documents[0];
          setUser({
            ...loggedInUser,
            fullName: userProfile.fullName,
            role: userProfile.role,
            firmId: userProfile.firmId,
          });
        } else {
          setUser(loggedInUser);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
};
