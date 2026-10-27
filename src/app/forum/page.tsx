import { Metadata } from 'next';
import { CommunityBoard } from '@/components/community/CommunityBoard';

export const metadata: Metadata = {
  title: 'IBC Community Forum & Statutory Bare Act Knowledge Base | Agentic Professionals',
  description:
    'Sovereign commercial law & CIRP community forum for advocates, insolvency practitioners, and researchers. Pose statutory inquiries to our 64k-entity Azure LightRAG knowledge graph.',
  keywords: [
    'IBC 2016',
    'CIRP regulations',
    'Section 29A eligibility',
    'NCLT precedents',
    'Insolvency forum',
    'Legal knowledge graph',
    'Agentic Professionals',
    'Hayagriva Sovereign AI',
  ],
};

export default function ForumPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 py-6">
      <CommunityBoard />
    </main>
  );
}
