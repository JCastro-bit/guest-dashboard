import { getTable } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, MapPin, Users, Utensils, FileText, Calendar, AlertCircle } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { InvitationCard } from "@/components/invitation-card"

interface TableDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: TableDetailsPageProps): Promise<Metadata> {
  const { id } = await params

  try {
    const table = await getTable(id)
    const guestCount = table.guestCount || 0
    const available = table.available || table.capacity

    const description = `Table ${table.name}. Capacity: ${table.capacity}, Assigned guests: ${guestCount}, Available seats: ${available}.`

    return {
      title: table.name,
      description,
      openGraph: {
        title: `${table.name} | Guest Dashboard`,
        description,
        url: `/tables/${id}`,
      },
      twitter: {
        card: "summary_large_image",
        title: `${table.name} | Guest Dashboard`,
        description,
      },
    }
  } catch (error) {
    return {
      title: "Table Not Found",
      description: "The requested table could not be found.",
    }
  }
}

export default async function TableDetailsPage({ params }: TableDetailsPageProps) {
  const { id } = await params

  try {
    const table = await getTable(id)

    const guestCount = table.guestCount || 0
    const available = table.available || table.capacity
    const invitations = table.invitations || []
    const isNearCapacity = available <= 2 && available > 0
    const isFull = available === 0

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/tables">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-serif font-bold tracking-tight">{table.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Created on {format(new Date(table.createdAt), "MMMM d, yyyy")}
              </p>
            </div>
          </div>
          {isFull ? (
            <Badge variant="destructive" className="gap-1">
              <AlertCircle className="h-3 w-3" />
              Full
            </Badge>
          ) : isNearCapacity ? (
            <Badge variant="outline" className="border-orange-500 text-orange-600 gap-1">
              <AlertCircle className="h-3 w-3" />
              {available} seats left
            </Badge>
          ) : (
            <Badge variant="outline" className="border-green-500 text-green-600">
              {available} seats available
            </Badge>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
              <Utensils className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{table.capacity}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Guests</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{guestCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Seats</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isFull ? 'text-red-600' : isNearCapacity ? 'text-orange-600' : 'text-green-600'}`}>
                {available}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Table Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Table Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Capacity */}
                  <div className="flex items-start gap-3">
                    <Utensils className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Capacity</p>
                      <p className="text-sm text-muted-foreground">{table.capacity} seats</p>
                    </div>
                  </div>

                  {/* Location */}
                  {table.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">{table.location}</p>
                      </div>
                    </div>
                  )}

                  {/* Guest Count */}
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Assigned Guests</p>
                      <p className="text-sm text-muted-foreground">
                        {guestCount} {guestCount === 1 ? "guest" : "guests"}
                      </p>
                    </div>
                  </div>

                  {/* Invitations Count */}
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Invitations</p>
                      <p className="text-sm text-muted-foreground">
                        {invitations.length} {invitations.length === 1 ? "invitation" : "invitations"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {table.notes && (
                  <div className="flex items-start gap-3 pt-4 border-t">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-2">Notes</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {table.notes}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Invitations Section */}
            <Card>
              <CardHeader>
                <CardTitle>Assigned Invitations ({invitations.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {invitations.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {invitations.map((invitation) => (
                      <InvitationCard key={invitation.id} invitation={invitation} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No invitations assigned to this table yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Capacity Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Capacity Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Occupancy</span>
                      <span className="text-sm text-muted-foreground">
                        {guestCount}/{table.capacity}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          isFull
                            ? "bg-red-600"
                            : isNearCapacity
                            ? "bg-orange-500"
                            : "bg-green-600"
                        }`}
                        style={{ width: `${(guestCount / table.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Capacity:</span>
                      <span className="font-medium">{table.capacity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Assigned:</span>
                      <span className="font-medium">{guestCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Available:</span>
                      <span className={`font-medium ${isFull ? 'text-red-600' : isNearCapacity ? 'text-orange-600' : 'text-green-600'}`}>
                        {available}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Failed to load table:", error)
    notFound()
  }
}
