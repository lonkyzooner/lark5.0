import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {
  Bell,
  FileText,
  Mic,
  Shield,
  Users
} from 'lucide-react';

const DashboardOverviewFixed: React.FC = () => {
  // Debug log to verify component is rendering
  console.log('DashboardOverviewFixed is rendering');

  // Simple greeting based on time of day
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    let greeting = 'Hello';

    if (currentHour < 12) {
      greeting = 'Good morning';
    } else if (currentHour < 18) {
      greeting = 'Good afternoon';
    } else {
      greeting = 'Good evening';
    }

    return `${greeting}, Officer`;
  };

  // Function to handle tab navigation
  const navigateToTab = (tabId: string) => {
    // Create and dispatch a custom event to change the active tab
    const event = new CustomEvent('changeTab', { detail: { tabId } });
    document.dispatchEvent(event);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#002166]">{getGreeting()}</h2>
        <p className="text-gray-600 mt-1">Welcome to your LARK dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-[rgba(255,255,255,0.5)] bg-white/95 backdrop-blur-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#002166] flex items-center gap-2">
              <Mic className="h-5 w-5 text-blue-600" />
              Voice Assistant
            </CardTitle>
            <CardDescription>Access voice commands and assistance</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigateToTab('voice')}
              className="w-full bg-gradient-to-r from-[#002166] to-[#0046c7] text-white"
            >
              Open Assistant
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-[rgba(255,255,255,0.5)] bg-white/95 backdrop-blur-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#002166] flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Miranda Rights
            </CardTitle>
            <CardDescription>Access and deliver Miranda rights</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigateToTab('miranda')}
              className="w-full bg-gradient-to-r from-[#002166] to-[#0046c7] text-white"
            >
              Open Miranda
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-[rgba(255,255,255,0.5)] bg-white/95 backdrop-blur-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#002166] flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Statutes
            </CardTitle>
            <CardDescription>Access legal statutes and codes</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigateToTab('statutes')}
              className="w-full bg-gradient-to-r from-[#002166] to-[#0046c7] text-white"
            >
              Open Statutes
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-[rgba(255,255,255,0.5)] bg-white/95 backdrop-blur-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#002166] flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              Alerts
            </CardTitle>
            <CardDescription>View system alerts and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 mb-2">No new alerts</div>
            <Button
              variant="outline"
              className="w-full border-[#002166] text-[#002166]"
            >
              View History
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-[rgba(255,255,255,0.5)] bg-white/95 backdrop-blur-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#002166] flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Tools
            </CardTitle>
            <CardDescription>Access additional tools and utilities</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigateToTab('tools')}
              className="w-full bg-gradient-to-r from-[#002166] to-[#0046c7] text-white"
            >
              Open Tools
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverviewFixed;
