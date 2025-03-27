import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QueriesPage() {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl font-bold mb-6">Queries</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Custom Queries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Create and manage your custom queries
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Query Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Start with pre-built query templates
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Query History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              View and analyze your query executions
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}