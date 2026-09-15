import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './lib/auth'
import { AIChatbot } from './routes/AIChatbot'
import { DestinationDetail } from './routes/DestinationDetail'
import { DiscoverSwipe } from './routes/DiscoverSwipe'
import { EventDiscovery } from './routes/EventDiscovery'
import { Home } from './routes/Home'
import { ItineraryMap } from './routes/ItineraryMap'
import { ItineraryPlanner } from './routes/ItineraryPlanner'
import { Login } from './routes/Login'
import { MyTrips } from './routes/MyTrips'
import { PlanBudget } from './routes/PlanBudget'
import { PlanDates } from './routes/PlanDates'
import { PlanInterests } from './routes/PlanInterests'
import { PlanWho } from './routes/PlanWho'
import { Profile } from './routes/Profile'
import { RecommendedItinerary } from './routes/RecommendedItinerary'
import { SignUp } from './routes/SignUp'
import { TripDashboard } from './routes/TripDashboard'
import { WhatToDo } from './routes/WhatToDo'
import { WhereToEat } from './routes/WhereToEat'
import { WhereToStay } from './routes/WhereToStay'

const queryClient = new QueryClient()

function withShell(node: ReactNode, showNav = true) {
  return <AppShell showNav={showNav}>{node}</AppShell>
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth — no tab bar */}
            <Route path="/login" element={withShell(<Login />, false)} />
            <Route path="/signup" element={withShell(<SignUp />, false)} />

            {/* Core tabs */}
            <Route path="/" element={withShell(<Home />)} />
            <Route path="/explore" element={withShell(<DiscoverSwipe />)} />
            <Route path="/itinerary/recommended" element={withShell(<RecommendedItinerary />)} />
            <Route path="/trips" element={withShell(<ProtectedRoute><MyTrips /></ProtectedRoute>)} />
            <Route path="/profile" element={withShell(<ProtectedRoute><Profile /></ProtectedRoute>)} />

            {/* AI + browse */}
            <Route path="/chat" element={withShell(<AIChatbot />)} />
            <Route path="/planner" element={withShell(<ProtectedRoute><ItineraryPlanner /></ProtectedRoute>)} />
            <Route path="/events" element={withShell(<EventDiscovery />)} />
            <Route path="/stay" element={withShell(<WhereToStay />)} />
            <Route path="/eat" element={withShell(<WhereToEat />)} />
            <Route path="/do" element={withShell(<WhatToDo />)} />
            <Route path="/destination/:id" element={withShell(<DestinationDetail />)} />
            <Route path="/itinerary/map" element={withShell(<ItineraryMap />)} />
            <Route path="/trip/:tripId" element={withShell(<ProtectedRoute><TripDashboard /></ProtectedRoute>)} />

            {/* Plan Trip wizard — no tab bar, requires auth (a trip needs an owner) */}
            <Route path="/plan/who" element={withShell(<ProtectedRoute><PlanWho /></ProtectedRoute>, false)} />
            <Route path="/plan/dates" element={withShell(<ProtectedRoute><PlanDates /></ProtectedRoute>, false)} />
            <Route path="/plan/budget" element={withShell(<ProtectedRoute><PlanBudget /></ProtectedRoute>, false)} />
            <Route
              path="/plan/interests"
              element={withShell(
                <ProtectedRoute>
                  <PlanInterests />
                </ProtectedRoute>,
                false,
              )}
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
