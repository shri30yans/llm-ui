import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ToolsPage() {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl font-bold mb-6">Tools</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Code Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Analyze your code for patterns, complexity, and potential improvements
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Documentation Generator</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Generate comprehensive documentation from your codebase
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Code Formatter</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Format your code according to best practices and style guides
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}