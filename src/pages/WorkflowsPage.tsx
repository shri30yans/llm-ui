import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WorkflowsPage() {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl font-bold mb-6">Workflows</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Custom Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Create and manage your automated workflows
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Workflow Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Start with pre-built workflow templates
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Workflow History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              View and analyze your workflow executions
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}