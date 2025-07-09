"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthForm } from "@/components/auth-form"
import { Dashboard } from "@/components/dashboard"
import { TeamsManager } from "@/components/teams-manager"
import { BookingCalendar } from "@/components/booking-calendar"
import { BookingsList } from "@/components/bookings-list"
import { useAuth } from "@/hooks/use-auth"
import { Building2, Calendar, Users, BookOpen } from "lucide-react"

export default function InspectionBookingSystem() {
  const { user, token, login, logout, register } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Building2 className="mx-auto h-12 w-12 text-indigo-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Inspection Booking</h1>
            <p className="text-gray-600 mt-2">Multi-tenant inspection management system</p>
          </div>
          <AuthForm onLogin={login} onRegister={register} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Inspection Booking</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Teams
            </TabsTrigger>
            <TabsTrigger value="booking" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Book Inspection
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              My Bookings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="teams">
            <TeamsManager />
          </TabsContent>

          <TabsContent value="booking">
            <BookingCalendar />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingsList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
