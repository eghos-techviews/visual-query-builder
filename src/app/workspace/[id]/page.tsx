import { WorkspaceClient } from "@/components/workspace/WorkspaceClient";

export default function WorkspacePage({ params }: { params: { id: string } }) {
  return <WorkspaceClient workspaceId={params.id} />;
}
