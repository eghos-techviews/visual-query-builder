import { WorkspaceClient } from "@/components/workspace/WorkspaceClient";
import { SCHEMA_REGISTRY } from "@/lib/schema/schemas";

export default async function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const schema = SCHEMA_REGISTRY.find((s) => s.id === id);
  const workspaceName = schema?.label ?? "Workspace";

  return <WorkspaceClient workspaceId={id} initialSchemaId={schema?.id} workspaceName={workspaceName} />;
}
