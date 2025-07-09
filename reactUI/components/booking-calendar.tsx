"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalendarIcon, Clock, Users, CheckCircle } from "lucide-react"
import { apiService } from "@/lib/api-service"
import { format, addDays, isWithinInterval, parseISO } from "date-fns"
import { DateRange } from "react-day-picker"

interface Team {
  id: number
  name: string
  description: string
}

interface TimeSlot {
  start_time: string
  end_time: string
  available: boolean
  date: string
}

export function BookingCalendar() {
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null)
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(undefined)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  useEffect(() => {
    loadTeams()
  }, [])

  useEffect(() => {
    if (selectedTeam && selectedRange && selectedRange.from && selectedRange.to) {
      loadTimeSlots()
    }
  }, [selectedTeam, selectedRange])

  const loadTeams = async () => {
    try {
      const data = await apiService.get("/teams")
      setTeams(data)
    } catch (error) {
      console.error("Failed to load teams:", error)
    }
  }

  const loadTimeSlots = async () => {
    if (!selectedTeam || !selectedRange || !selectedRange.from || !selectedRange.to) return

    setIsLoading(true)
    try {
      const fromDate = format(selectedRange.from, "yyyy-MM-dd")
      const toDate = format(selectedRange.to, "yyyy-MM-dd")

      const slots = await apiService.get(`/teams/${selectedTeam}/generate-slots?from=${fromDate}&to=${toDate}`)
      setTimeSlots(slots)
    } catch (error) {
      console.error("Failed to load time slots:", error)
      setTimeSlots([])
    } finally {
      setIsLoading(false)
    }
  }

  const bookSlot = async () => {
    if (!selectedTeam || !selectedSlot) return

    try {
      await apiService.post("/bookings", {
        team_id: selectedTeam,
        date: selectedSlot.date,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
      })

      setBookingSuccess(true)
      setIsBookingDialogOpen(false)
      loadTimeSlots() // Refresh slots

      // Hide success message after 3 seconds
      setTimeout(() => setBookingSuccess(false), 3000)
    } catch (error) {
      console.error("Failed to book slot:", error)
    }
  }

  const getTeamName = (teamId: number) => {
    return teams.find((t) => t.id === teamId)?.name || "Unknown Team"
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Book Inspection</h2>
        <p className="text-gray-600">Select a team, date, and time slot for your inspection</p>
      </div>

      {bookingSuccess && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>Booking confirmed successfully! Check your bookings tab for details.</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="min-h-[350px] h-[calc(100vh-450px)] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Select Team
            </CardTitle>
            <CardDescription>Choose an inspection team</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <Select
              value={selectedTeam?.toString() || ""}
              onValueChange={(value) => setSelectedTeam(Number.parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id.toString()}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="min-h-[350px] h-[calc(100vh-450px)] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Select Date Range
            </CardTitle>
            <CardDescription>Choose inspection date range</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <Calendar
              mode="range"
              selected={selectedRange}
              onSelect={setSelectedRange}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="min-h-[350px] h-[calc(100vh-450px)] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Available Slots
            </CardTitle>
            <CardDescription>
              {selectedRange && selectedRange.from && selectedRange.to
                ? `${format(selectedRange.from, "MMMM d, yyyy")} - ${format(selectedRange.to, "MMMM d, yyyy")}`
                : "Select a date range"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            {!selectedTeam || !selectedRange || !selectedRange.from || !selectedRange.to ? (
              <p className="text-gray-500 text-center py-4">Please select a team and date range first</p>
            ) : isLoading ? (
              <p className="text-gray-500 text-center py-4">Loading slots...</p>
            ) : timeSlots.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No available slots for this range</p>
            ) : (
              <div className="space-y-4">
                {Array.from(
                  new Set(timeSlots.map((slot) => slot.date))
                ).map((date) => (
                  <div key={date}>
                    <div className="font-semibold mb-2">{format(parseISO(date), "MMMM d, yyyy")}</div>
                    <div className="space-y-2">
                      {timeSlots
                        .filter((slot) => slot.date === date)
                        .map((slot, index) => (
                          <Button
                            key={index}
                            variant={slot.available ? "outline" : "secondary"}
                            className="w-full justify-between"
                            disabled={!slot.available}
                            onClick={() => {
                              setSelectedSlot(slot)
                              setIsBookingDialogOpen(true)
                            }}
                          >
                            <span>
                              {slot.start_time} - {slot.end_time}
                            </span>
                            <Badge variant={slot.available ? "default" : "secondary"}>
                              {slot.available ? "Available" : "Booked"}
                            </Badge>
                          </Button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogDescription>Please confirm your inspection booking details</DialogDescription>
          </DialogHeader>
          {selectedSlot && selectedTeam && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900">Team</h4>
                  <p className="text-gray-600">{getTeamName(selectedTeam)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Date</h4>
                  <p className="text-gray-600">{format(selectedSlot.date, "MMMM d, yyyy")}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Time</h4>
                  <p className="text-gray-600">
                    {selectedSlot.start_time} - {selectedSlot.end_time}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Duration</h4>
                  <p className="text-gray-600">1 hour</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={bookSlot} className="flex-1">
                  Confirm Booking
                </Button>
                <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
