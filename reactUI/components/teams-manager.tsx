"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, Clock, Edit, Loader2 } from "lucide-react"
import { apiService } from "@/lib/api-service"

interface Team {
  id: number
  name: string
  description: string
  availabilities?: TeamAvailability[]
}

interface TeamAvailability {
  id: number
  weekday: number
  start_time: string
  end_time: string
}

const DAYS_OF_WEEK = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 0, label: "Sunday" },
]

// Utility to format time in 12-hour format
function formatTime12h(time: string) {
  if (!time) return ""
  const [hour, minute] = time.split(":")
  let h = parseInt(hour, 10)
  const ampm = h >= 12 ? "PM" : "AM"
  h = h % 12
  if (h === 0) h = 12
  return `${h}:${minute} ${ampm}`
}

export function TeamsManager() {
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoadingTeams, setIsLoadingTeams] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isAvailabilityDialogOpen, setIsAvailabilityDialogOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [newTeam, setNewTeam] = useState({ name: "", description: "" })
  const [availabilityWeek, setAvailabilityWeek] = useState(() =>
    DAYS_OF_WEEK.map((day) => ({
      weekday: day.value,
      start_time: "",
      end_time: "",
    }))
  )
  const [isSavingAvailability, setIsSavingAvailability] = useState(false)
  const [isCreatingTeam, setIsCreatingTeam] = useState(false)

  // When opening dialog, pre-fill with existing availability
  useEffect(() => {
    if (isAvailabilityDialogOpen && selectedTeam) {
      setAvailabilityWeek(
        DAYS_OF_WEEK.map((day) => {
          const found = selectedTeam.availabilities?.find((a: TeamAvailability) => a.weekday === day.value)
          return {
            weekday: day.value,
            start_time: found ? found.start_time : "",
            end_time: found ? found.end_time : "",
          }
        })
      )
    }
  }, [isAvailabilityDialogOpen, selectedTeam])

  useEffect(() => {
    loadTeams()
  }, [])

  const loadTeams = async () => {
    setIsLoadingTeams(true)
    try {
      const data = await apiService.get("/teams")
      setTeams(data)
    } catch (error) {
      console.error("Failed to load teams:", error)
    }
    setIsLoadingTeams(false)
  }

  const createTeam = async () => {
    setIsCreatingTeam(true)
    try {
      await apiService.post("/teams", newTeam)
      setNewTeam({ name: "", description: "" })
      setIsCreateDialogOpen(false)
      loadTeams()
    } catch (error) {
      console.error("Failed to create team:", error)
    }
    setIsCreatingTeam(false)
  }

  const setTeamAvailability = async () => {
    if (!selectedTeam) return
    // Only send days with both start and end time
    const availabilities = availabilityWeek.filter(a => a.start_time && a.end_time)
    setIsSavingAvailability(true)
    try {
      await apiService.post(`/teams/${selectedTeam.id}/availability`, { availabilities })
      setIsAvailabilityDialogOpen(false)
      loadTeams()
    } catch (error) {
      console.error("Failed to set availability:", error)
    }
    setIsSavingAvailability(false)
  }

  const getDayName = (dayOfWeek: number) => {
    return DAYS_OF_WEEK.find((d) => d.value === dayOfWeek)?.label || "Unknown"
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Teams Management</h2>
          <p className="text-gray-600">Manage your inspection teams and their availability</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
              <DialogDescription>Add a new inspection team to your organization</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="team-name">Team Name</Label>
                <Input
                  id="team-name"
                  placeholder="Enter team name"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="team-description">Description</Label>
                <Input
                  id="team-description"
                  placeholder="Enter team description"
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                />
              </div>
              <Button onClick={createTeam} className="w-full" disabled={isCreatingTeam}>
                {isCreatingTeam && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Team
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoadingTeams ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : teams.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-12">No teams found.</div>
        ) : teams.map((team) => (
          <Card key={team.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  <CardTitle className="text-lg">{team.name}</CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedTeam(team)
                    setIsAvailabilityDialogOpen(true)
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>{team.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Availability:</span>
                </div>
                {team.availabilities && team.availabilities.length > 0 ? (
                  <div className="space-y-1">
                    {team.availabilities.map((avail: TeamAvailability) => (
                      <div key={avail.id} className="flex items-center justify-between">
                        <Badge variant="outline">{getDayName(avail.weekday)}</Badge>
                        <span className="text-sm text-gray-600">
                          {formatTime12h(avail.start_time)} - {formatTime12h(avail.end_time)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No availability set</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isAvailabilityDialogOpen} onOpenChange={setIsAvailabilityDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Team Availability</DialogTitle>
            <DialogDescription>Configure when {selectedTeam?.name} is available for inspections</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {DAYS_OF_WEEK.map((day, idx) => (
              <div key={day.value} className="flex items-center gap-4">
                <Label className="w-24">{day.label}</Label>
                <Input
                  type="time"
                  value={availabilityWeek[idx].start_time}
                  onChange={e => {
                    const updated = [...availabilityWeek]
                    updated[idx].start_time = e.target.value
                    setAvailabilityWeek(updated)
                  }}
                  className="w-32"
                />
                <span>to</span>
                <Input
                  type="time"
                  value={availabilityWeek[idx].end_time}
                  onChange={e => {
                    const updated = [...availabilityWeek]
                    updated[idx].end_time = e.target.value
                    setAvailabilityWeek(updated)
                  }}
                  className="w-32"
                />
              </div>
            ))}
            <Button onClick={setTeamAvailability} className="w-full mt-4" disabled={isSavingAvailability}>
              {isSavingAvailability && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Availability
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
