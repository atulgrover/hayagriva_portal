// admin-panel/src/app/dashboard/community/page.tsx
import { CommunityBoard } from '@/components/community/CommunityBoard';

export const metadata = {
  title: 'Practitioner Community & LightRAG Bot | Hayagriva Sovereign AI Suite',
  description: 'In-portal legal discussions, statutory guidance, and automated Azure LightRAG knowledge graph analysis.',
};

export default function CommunityPage() {
  return (
    <div className="py-2">
      <CommunityBoard />
    </div>
  );
}
