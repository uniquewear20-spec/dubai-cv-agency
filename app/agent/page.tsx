// app/agent/page.tsx — the Zenith AI job-application agent.
import type { Metadata } from "next";
import AgentApp from "@/components/agent/AgentApp";
import "./agent.css";

export const metadata: Metadata = {
  title: "AI job agent",
  description:
    "Search public job sources, rank every listing against your CV, prepare tailored applications you approve, and track them to the offer. Your CV stays in your browser.",
  alternates: { canonical: "/agent/" },
};

export default function AgentPage() {
  return <AgentApp />;
}
