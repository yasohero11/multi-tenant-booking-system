"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Clock, CheckCircle } from "lucide-react"
import { apiService } from "@/lib/api-service"

interface DashboardStats {
  totalTeams: number
  totalBookings: number
  upcomingBookings: number
}

interface RecentBooking {
  id: number
  team_name: string
  date: string
  start_time: string
  end_time: string
  status: string
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTeams: 0,
    totalBookings: 0,
    upcomingBookings: 0,
  })
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
  const [tenantInfo, setTenantInfo] = useState<any>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Load tenant info
      const tenant = await apiService.get("/tenant")
      setTenantInfo(tenant)

      // Load teams
      const teams = await apiService.get("/teams")

      // Load bookings
      const bookings = await apiService.get("/bookings")


      const upcoming = bookings.filter((b: any) => new Date(b.date) >= new Date()).length


      setStats({
        totalTeams: teams.length,
        totalBookings: bookings.length,
        upcomingBookings: upcoming
      })

      // Set recent bookings (last 5)
      setRecentBookings(bookings.slice(0, 5))
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Welcome to {tenantInfo?.name || "your"} inspection management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeams}</div>
            <p className="text-xs text-muted-foreground">Active inspection teams</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">All time bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingBookings}</div>
            <p className="text-xs text-muted-foreground">Scheduled inspections</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Your latest inspection bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBookings.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No bookings yet</p>
            ) : (
              recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{booking.team_name}</h4>
                    <p className="text-sm text-gray-600">
                      {booking.date} • {booking.start_time} - {booking.end_time}
                    </p>
                  </div>
                  <Badge variant={booking.status === "completed" ? "default" : "secondary"}>{booking.status}</Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
