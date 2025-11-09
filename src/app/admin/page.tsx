import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AdminDashboard() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1"
      >
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
            <Card>
                <CardHeader className="pb-2">
                <CardDescription>Total Products</CardDescription>
                <CardTitle className="text-4xl">12</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="text-xs text-muted-foreground">
                    +2 from last month
                </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                <CardDescription>Gallery Items</CardDescription>
                <CardTitle className="text-4xl">8</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="text-xs text-muted-foreground">
                    +1 from last month
                </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </>
  )
}
