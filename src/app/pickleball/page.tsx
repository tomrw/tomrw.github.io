import type { Metadata } from "next";
import PickleballClient from "./Client";

export const metadata: Metadata = {
  title: "Pickleball",
  description: "Pickleball notes, places, and drills",
};

export default function PickleballPage() {


  return <PickleballClient />;
}
