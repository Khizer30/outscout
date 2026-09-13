import MapPageContent from "@features/map/components/MapPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Map"
};

export default function MapPage() {
  return <MapPageContent />;
}
