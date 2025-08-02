"use client";

import { Models } from "appwrite";

// This defines the shape of our location data based on your screenshot
export interface Location extends Models.Document {
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  firmId: string;
  contact?: string;
}

// We are keeping this file for the type definition, but the columns are no longer needed for the card layout.
export const columns = [];
