import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import {
  BookText,
  Shield,
  Mic,
  AlertTriangle,
  Settings,
  Tool,
  Clock,
  FileText
} from 'lucide-react';

/**
 * A completely new dashboard component with minimal dependencies
 * Designed to be simple, reliable, and easy to maintain
 */
const SimpleLarkDashboard: React.FC = () => {
  // Function to navigate to different tabs
  const navigateToTab = (tabId: string) => {
    // Create and dispatch a custom event to change the active tab
    const event = new CustomEvent('changeTab', { detail: { tabId } });
    document.dispatchEvent(event);
  };

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900">{getGreeting()}, Officer</h1>
        <p className="text-gray-600 mt-1">Welcome to your LARK dashboard</p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-blue-800 flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            onClick={() => navigateToTab('voice')}
            className="h-auto py-4 flex flex-col items-center bg-gradient-to-r from-blue-900 to-blue-700"
          >
            <Mic className="h-6 w-6 mb-2" />
            <span>Voice Assistant</span>
          </Button>
          <Button 
            onClick={() => navigateToTab('miranda')}
            className="h-auto py-4 flex flex-col items-center bg-gradient-to-r from-blue-900 to-blue-700"
          >
            <Shield className="h-6 w-6 mb-2" />
            <span>Miranda Rights</span>
          </Button>
          <Button 
            onClick={() => navigateToTab('statutes')}
            className="h-auto py-4 flex flex-col items-center bg-gradient-to-r from-blue-900 to-blue-700"
          >
            <BookText className="h-6 w-6 mb-2" />
            <span>Statutes</span>
          </Button>
          <Button 
            onClick={() => navigateToTab('tools')}
            className="h-auto py-4 flex flex-col items-center bg-gradient-to-r from-blue-900 to-blue-700"
          >
            <Tool className="h-6 w-6 mb-2" />
            <span>Tools</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-blue-800 flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Recent Activity
          </h2>
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
            <div className="space-y-4">
              <div className="p-3 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Mic className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium">Voice Assistant Used</span>
                  </div>
                  <span className="text-xs text-gray-500">Just now</span>
                </div>
              </div>
              <div className="p-3 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium">Miranda Rights Read</span>
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
              </div>
              <div className="p-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <BookText className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium">Statute Lookup</span>
                  </div>
                  <span className="text-xs text-gray-500">Yesterday</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-blue-800 flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Alerts
          </h2>
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No new alerts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Link */}
      <div className="mt-8 text-center">
        <Button 
          variant="outline"
          onClick={() => navigateToTab('settings')}
          className="inline-flex items-center"
        >
          <Settings className="h-4 w-4 mr-2" />
          <span>Open Settings</span>
        </Button>
      </div>
    </div>
  );
};

export default SimpleLarkDashboard;
