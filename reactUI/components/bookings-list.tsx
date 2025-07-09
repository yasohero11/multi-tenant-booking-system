"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, Users, Trash2, AlertTriangle } from "lucide-react"
import { apiService } from "@/lib/api-service"
import { format } from "date-fns"

interface Booking {
  id: number
  team_id: number
  team_name: string
  date: string
  start_time: string
  end_time: string
  status: string
  created_at: string
}

export function BookingsList() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [cancelSuccess, setCancelSuccess] = useState(false)

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    setIsLoading(true)
    try {
      const data = await apiService.get("/bookings")
      // Sort bookings by date and time
      const sortedBookings = data.sort((a: Booking, b: Booking) => {
        const dateA = new Date(`${a.date} ${a.start_time}`)
        const dateB = new Date(`${b.date} ${b.start_time}`)
        return dateB.getTime() - dateA.getTime()
      })
      setBookings(sortedBookings)
    } catch (error) {
      console.error("Failed to load bookings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const cancelBooking = async () => {
    if (!selectedBooking) return

    try {
      await apiService.delete(`/bookings/${selectedBooking.id}`)
      setCancelSuccess(true)
      setIsCancelDialogOpen(false)
      loadBookings()

      // Hide success message after 3 seconds
      setTimeout(() => setCancelSuccess(false), 3000)
    } catch (error) {
      console.error("Failed to cancel booking:", error)
    }
  }

  const isUpcoming = (date: string, startTime: string) => {
    const bookingDateTime = new Date(`${date} ${startTime}`)
    return bookingDateTime > new Date()
  }

  const upcomingBookings = bookings.filter((b) => isUpcoming(b.date, b.start_time))
  const pastBookings = bookings.filter((b) => !isUpcoming(b.date, b.start_time))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500">Loading bookings...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
        <p className="text-gray-600">View and manage your inspection bookings</p>
      </div>

      {cancelSuccess && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Booking cancelled successfully.</AlertDescription>
        </Alert>
      )}

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600">Start by booking your first inspection</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {upcomingBookings.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Bookings</h3>
              <div className="grid gap-4">
                {upcomingBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Users className="h-5 w-5 text-indigo-600" />
                          <div>
                            <CardTitle className="text-lg">{booking.team_name}</CardTitle>
                            <CardDescription>Inspection Team • ID: {booking.id}</CardDescription>
                          </div>
                        </div>                      
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{format(new Date(booking.date), "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {booking.start_time} - {booking.end_time}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Booked: {format(new Date(booking.created_at), "MMM d, yyyy")}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {pastBookings.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Past Bookings</h3>
              <div className="grid gap-4">
                {pastBookings.map((booking) => (
                  <Card key={booking.id} className="opacity-75">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Users className="h-5 w-5 text-gray-400" />
                          <div>
                            <CardTitle className="text-lg">{booking.team_name}</CardTitle>
                            <CardDescription>Inspection Team • ID: {booking.id}</CardDescription>
                          </div>
                        </div>
                        
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{format(new Date(booking.date), "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {booking.start_time} - {booking.end_time}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Booked: {format(new Date(booking.created_at), "MMM d, yyyy")}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{selectedBooking.team_name}</h4>
                <p className="text-sm text-gray-600">
                  {format(new Date(selectedBooking.date), "MMMM d, yyyy")} • {selectedBooking.start_time} -{" "}
                  {selectedBooking.end_time}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="destructive" onClick={cancelBooking} className="flex-1">
                  Cancel Booking
                </Button>
                <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
                  Keep Booking
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
