// app/review/page.tsx — clients share their experience; publishing needs their explicit consent.
import type { Metadata } from "next";
import ReviewApp from "@/components/review/ReviewApp";

export const metadata: Metadata = {
  title: "Share your experience",
  description: "Tell Zenith Dubai how your CV, profile or applications went. Nothing is published without your consent.",
  alternates: { canonical: "/review/" },
  robots: { index: false, follow: true },
};

export default function ReviewPage() {
  return <ReviewApp />;
}
