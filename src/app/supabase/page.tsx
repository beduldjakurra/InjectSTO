'use client'

import { useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import AuthForm from '@/components/auth/AuthForm'
import useSupabaseProductionStore from '@/store/supabaseProductionStore'
import TabNavigation from '@/components/production/TabNavigation'
import Header from '@/components/production/Header'
import Footer from '@/components/production/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function SupabaseApp() {
  const { user, loading, signOut, isSupabaseConfigured } = useAuth()
  const {
    currentSessionId,
    sessionName,
    syncStatus,
    lastSyncTime,
    isOnline,
    initializeSession,
    loadProductionData,
    syncToSupabase,
    resetData
  } = useSupabaseProductionStore()

  // Initialize session when user logs in
  useEffect(() => {
    if (user && !currentSessionId && isSupabaseConfigured) {
      const sessionName = `${user.email?.split('@')[0]} - ${new Date().toLocaleDateString()}`
      initializeSession(user.id, sessionName)
    }
  }, [user, currentSessionId, initializeSession, isSupabaseConfigured])

  // Handle user logout
  const handleSignOut = async () => {
    resetData()
    await signOut()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show setup message if Supabase not configured
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-blue-600">
              PT Fuji Seat Indonesia - STO
            </CardTitle>
            <CardDescription>
              Supabase Integration Setup Required
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertDescription>
                <strong>Setup Required:</strong> Supabase credentials belum dikonfigurasi.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">🚀 Quick Setup Steps:</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Badge>1</Badge>
                  <div>
                    <strong>Create Supabase Account:</strong>
                    <br />
                    <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 hover:underline">
                      https://supabase.com/dashboard
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Badge>2</Badge>
                  <div>
                    <strong>Create New Project:</strong>
                    <br />
                    Project name: <code className="bg-gray-100 px-1 rounded">fuji-seat-sto</code>
                    <br />
                    Region: Southeast Asia (Singapore)
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Badge>3</Badge>
                  <div>
                    <strong>Get API Credentials:</strong>
                    <br />
                    Settings → API → Copy Project URL & Keys
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Badge>4</Badge>
                  <div>
                    <strong>Update .env.local:</strong>
                    <br />
                    Replace placeholder values dengan real credentials
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Badge>5</Badge>
                  <div>
                    <strong>Setup Database:</strong>
                    <br />
                    SQL Editor → Run <code className="bg-gray-100 px-1 rounded">supabase-schema.sql</code>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">📋 Files Ready:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>✅ <code>supabase-schema.sql</code> - Database schema</li>
                <li>✅ <code>.env.local</code> - Environment template</li>
                <li>✅ <code>SUPABASE-CHECKLIST.md</code> - Setup guide</li>
                <li>✅ <code>TEST-GUIDE.md</code> - Testing instructions</li>
              </ul>
            </div>
            
            <div className="text-center">
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-blue-600 hover:bg-blue-700"
              >
                Refresh After Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Status Bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Badge variant={isOnline ? "default" : "destructive"}>
              {isOnline ? "Online" : "Offline"}
            </Badge>
            <Badge variant={syncStatus === 'success' ? "default" : 
                           syncStatus === 'syncing' ? "secondary" : 
                           syncStatus === 'error' ? "destructive" : "outline"}>
              {syncStatus === 'success' ? "Synced" : 
               syncStatus === 'syncing' ? "Syncing..." : 
               syncStatus === 'error' ? "Sync Error" : "Ready"}
            </Badge>
            {lastSyncTime && (
              <span className="text-xs text-gray-500">
                Last sync: {lastSyncTime.toLocaleTimeString()}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {user.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={syncToSupabase}
              disabled={syncStatus === 'syncing'}
            >
              {syncStatus === 'syncing' ? 'Syncing...' : 'Sync'}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {currentSessionId ? (
          <>
            {/* Session Info */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">
                  PT Fuji Seat Indonesia - STO Production Management
                </CardTitle>
                <CardDescription>
                  Session: {sessionName} | User: {user.email}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Production Interface */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg">
              <Header />
              <div className="p-6">
                <TabNavigation />
              </div>
              <Footer />
            </div>
          </>
        ) : (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Initializing Session...</CardTitle>
              <CardDescription>
                Setting up your production workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}