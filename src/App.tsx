// App.tsx - LARK Voice Assistant
import React, { useState, useEffect, lazy, Suspense } from 'react';
import './styles/voice-assistant.css';
import './styles/fluid-theme.css';
// Import smaller components directly
import { VoiceIndicator } from './components/VoiceIndicator';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import LarkLogo from './components/LarkLogo';

// Lazy load larger components
// Use named import for LarkChat to avoid TypeScript issues
import { LarkChat } from './components/LarkChat';
const MirandaRights = lazy(() => import('./components/MirandaRights').then(module => ({ default: module.MirandaRights })));
const RSCodes = lazy(() => import('./components/RSCodes').then(module => ({ default: module.RSCodes })));
const ThreatDetection = lazy(() => import('./components/ThreatDetection').then(module => ({ default: module.ThreatDetection })));
const Tools = lazy(() => import('./components/Tools').then(module => ({ default: module.Tools })));
const Settings = lazy(() => import('./components/Settings').then(module => ({ default: module.Settings })));
const FluidDesignDemo = lazy(() => import('./components/FluidDesignDemo').then(module => ({ default: module.FluidDesignDemo })));
const LiveKitRealtimeVoiceTest = lazy(() => import('./components/LiveKitRealtimeVoiceTest'));
const AdvancedDashboard = lazy(() => import('./components/AdvancedDashboard').then(module => ({ default: module.AdvancedDashboard })));
import { LiveKitVoiceProvider } from './contexts/LiveKitVoiceContext';
import ErrorBoundary from './components/ErrorBoundary';
import MirandaErrorBoundary from './components/MirandaErrorBoundary';
import { startPerformanceMonitoring } from './utils/performanceMonitor';
import { initNetworkMonitoring } from './utils/networkOptimizer';
import PerformanceMonitor from './components/PerformanceMonitor';
import { 
  ShieldIcon, 
  BookTextIcon, 
  AlertTriangleIcon, 
  MicIcon, 
  Activity, 
  Radio, 
  BatteryMedium,
  Clock,
  MapPin,
  WifiIcon,
  CheckCircle2,
  WrenchIcon,
  Settings as SettingsIcon,
  Volume as VolumeUpIcon
} from 'lucide-react';

interface AppProps {
  initialTab?: string;
}

function App({ initialTab = 'voice' }: AppProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  // Fluid design is now the default and only design
  // Removed unused variable: const [showVoiceTest, setShowVoiceTest] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(87);
  const [connected, setConnected] = useState(true);
  const [location, setLocation] = useState('Baton Rouge, LA');
  const [showDashboard, setShowDashboard] = useState(false);
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false);

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Initialize performance and network monitoring
  useEffect(() => {
    // Start performance monitoring
    startPerformanceMonitoring();
    
    // Initialize network monitoring
    initNetworkMonitoring();
    
    // Initialize hardware if available
    import('./hardware/uniHikerM10').then(module => {
      module.initializeHardware().then(initialized => {
        if (initialized) {
          console.log('Hardware initialized successfully');
        }
      });
    }).catch(error => {
      console.warn('Hardware initialization not available:', error);
    });
  }, []);

  // Simulate battery drain
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel(prev => Math.max(prev - 1, 5));
    }, 300000); // Every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <LiveKitVoiceProvider>
      <div className="min-h-screen fluid-background text-foreground p-4 md:p-6 overflow-hidden antialiased selection:bg-primary/20 selection:text-primary relative" style={{ background: 'linear-gradient(135deg, #e9f2f9 0%, #d1e6f9 100%)' }}>
        {/* Decorative wave elements for fluid design */}
        <div className="fluid-wave"></div>
        <div className="fluid-wave-gold"></div>
        {/* Voice detection indicator - shows when voice is detected */}
        <VoiceIndicator />
        <div className="max-w-6xl mx-auto relative">
        {/* Enhanced background accents for visual interest */}
        
        {/* Modern header with sleek design */}
        <header className="mb-8 relative fluid-card rounded-2xl p-6 border border-[rgba(255,255,255,0.5)] backdrop-blur-sm shadow-md" style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)' }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-5 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground tracking-tight leading-none flex items-center">
                    <LarkLogo width={50} height={50} className="mr-2" />
                    <span className="fluid-heading">LARK</span>
                    <span className="ml-3 text-xs font-medium fluid-badge px-3 py-1 rounded-full">1.0</span>
                  </h1>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDashboard(!showDashboard)}
                      className="focus-ring font-medium rounded-full px-4 py-2 fluid-button bg-[#003087] text-white hover:bg-[#004db3]"
                    >
                      {showDashboard ? 'Hide Analytics' : 'Show Analytics'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPerformanceMonitor(!showPerformanceMonitor)}
                      className="focus-ring font-medium rounded-full px-4 py-2 fluid-button bg-[#003087] text-white hover:bg-[#004db3]"
                    >
                      {showPerformanceMonitor ? 'Hide Performance' : 'Show Performance'}
                    </Button>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-base font-light tracking-wide">
                Law Enforcement Assistance and Response Kit
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 mt-2 md:mt-0 w-full md:w-auto">
              {/* Location indicator */}
              <div className="flex items-center px-4 py-2 rounded-full bg-card text-card-foreground border border-border/10 shadow-sm transition-all hover:bg-secondary/10 group">
                <MapPin className="w-4 h-4 text-black/70 group-hover:text-black" />
                <span className="text-foreground text-sm font-medium ml-2 group-hover:text-black">{location}</span>
              </div>
              
              {/* Status indicators group */}
              <div className="flex items-center gap-4 px-5 py-2 rounded-full bg-card text-card-foreground border border-border/10 shadow-sm backdrop-blur-sm">
                {/* Time */}
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground text-sm font-medium ml-1.5 font-mono">{formatTime(currentTime)}</span>
                </div>
                
                <span className="w-[1px] h-4 bg-border"></span>
                
                {/* Battery */}
                <div className="flex items-center gap-1.5">
                  <BatteryMedium 
                    className={`w-4 h-4 ${batteryLevel < 20 ? 'text-destructive' : batteryLevel > 50 ? 'text-success' : 'text-warning'}`} 
                  />
                  <span className={`text-xs font-medium ml-0.5 ${batteryLevel < 20 ? 'text-destructive' : batteryLevel > 50 ? 'text-foreground' : 'text-warning'}`}>
                    {batteryLevel}%
                  </span>
                </div>
                
                {/* Connection status */}
                {connected ? (
                  <div className="flex items-center gap-1">
                    <WifiIcon className="w-4 h-4 text-success" />
                    <span className="text-xs font-medium text-success">Online</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <WifiIcon className="w-4 h-4 text-destructive" />
                    <span className="text-xs font-medium text-destructive">Offline</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="relative mb-8 space-y-6 z-10">
          {showDashboard && (
            <Suspense fallback={<div className="p-8 text-center">Loading dashboard...</div>}>
              <AdvancedDashboard />
            </Suspense>
          )}
          
          {/* Performance Monitor */}
          <PerformanceMonitor visible={showPerformanceMonitor} onClose={() => setShowPerformanceMonitor(false)} />

          
          <Tabs defaultValue="voice" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8 fluid-glass rounded-full p-2 flex flex-wrap md:flex-nowrap justify-between border border-[rgba(255,255,255,0.3)] shadow-sm gap-1 backdrop-blur-sm sticky top-0 z-20">
              <TabsTrigger 
                value="voice" 
                className="flex-1 rounded-full py-3 data-[state=active]:le-blue-accent data-[state=active]:text-white text-muted-foreground font-medium transition-all duration-200 hover:text-foreground focus-ring hover:bg-secondary/50 data-[state=active]:shadow-sm"
                style={{ backgroundColor: activeTab === 'voice' ? '#003087' : 'transparent', color: activeTab === 'voice' ? 'white' : 'inherit' }}
              >
                <div className="flex flex-col items-center gap-1.5">
                  <MicIcon className="h-5 w-5" />
                  <span className="text-xs font-medium">Assistant</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="miranda" 
                className="flex-1 rounded-full py-3 data-[state=active]:le-blue-accent data-[state=active]:text-white text-muted-foreground font-medium transition-all duration-200 hover:text-foreground focus-ring hover:bg-secondary/50 data-[state=active]:shadow-sm"
                style={{ backgroundColor: activeTab === 'miranda' ? '#003087' : 'transparent', color: activeTab === 'miranda' ? 'white' : 'inherit' }}
              >
                <div className="flex flex-col items-center gap-1.5">
                  <BookTextIcon className="h-5 w-5" />
                  <span className="text-xs font-medium">Miranda</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="statutes" 
                className="flex-1 rounded-full py-3 data-[state=active]:le-blue-accent data-[state=active]:text-white text-muted-foreground font-medium transition-all duration-200 hover:text-foreground focus-ring hover:bg-secondary/50 data-[state=active]:shadow-sm"
                style={{ backgroundColor: activeTab === 'statutes' ? '#003087' : 'transparent', color: activeTab === 'statutes' ? 'white' : 'inherit' }}
              >
                <div className="flex flex-col items-center gap-1.5">
                  <ShieldIcon className="h-5 w-5" />
                  <span className="text-xs font-medium">Statutes</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="threats" 
                className="flex-1 rounded-full py-3 data-[state=active]:le-blue-accent data-[state=active]:text-white text-muted-foreground font-medium transition-all duration-200 hover:text-foreground focus-ring hover:bg-secondary/50 data-[state=active]:shadow-sm"
                style={{ backgroundColor: activeTab === 'threats' ? '#003087' : 'transparent', color: activeTab === 'threats' ? 'white' : 'inherit' }}
              >
                <div className="flex flex-col items-center gap-1.5">
                  <AlertTriangleIcon className="h-5 w-5" />
                  <span className="text-xs font-medium">Threats</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="tools" 
                className="flex-1 rounded-full py-3 data-[state=active]:le-blue-accent data-[state=active]:text-white text-muted-foreground font-medium transition-all duration-200 hover:text-foreground focus-ring hover:bg-secondary/50 data-[state=active]:shadow-sm"
                style={{ backgroundColor: activeTab === 'tools' ? '#003087' : 'transparent', color: activeTab === 'tools' ? 'white' : 'inherit' }}
              >
                <div className="flex flex-col items-center gap-1.5">
                  <WrenchIcon className="h-5 w-5" />
                  <span className="text-xs font-medium">Tools</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="flex-1 rounded-full py-3 data-[state=active]:le-blue-accent data-[state=active]:text-white text-muted-foreground font-medium transition-all duration-200 hover:text-foreground focus-ring hover:bg-secondary/50 data-[state=active]:shadow-sm"
                style={{ backgroundColor: activeTab === 'settings' ? '#003087' : 'transparent', color: activeTab === 'settings' ? 'white' : 'inherit' }}
              >
                <div className="flex flex-col items-center gap-1.5">
                  <SettingsIcon className="h-5 w-5" />
                  <span className="text-xs font-medium">Settings</span>
                </div>
              </TabsTrigger>

            </TabsList>

            <div className="fluid-card rounded-xl overflow-hidden border border-[rgba(255,255,255,0.3)] shadow-md backdrop-blur-sm bg-opacity-90" style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)' }}>
              <TabsContent value="voice" className="focus-visible:outline-none focus-visible:ring-0 m-0 animate-in fade-in-50 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=active]:duration-300">
                <ErrorBoundary
                  onError={(error, errorInfo) => {
                    console.error('Voice Assistant Error:', error);
                    console.error('Component Stack:', errorInfo.componentStack);
                  }}
                  fallback={
                    <div className="p-6 text-center">
                      <h2 className="text-xl font-semibold text-destructive mb-3">Voice Assistant Error</h2>
                      <p className="mb-4 text-muted-foreground">The voice assistant encountered an error. Please try refreshing the page.</p>
                      <Button 
                        onClick={() => window.location.reload()}
                        className="bg-primary text-white hover:bg-primary/90"
                      >
                        Reload Application
                      </Button>
                    </div>
                  }
                >
                  <MirandaErrorBoundary
                    onMirandaError={(error) => {
                      console.error('Miranda functionality error:', error);
                      // Try to dispatch a fallback event to ensure Miranda rights can still be triggered
                      try {
                        document.dispatchEvent(new CustomEvent('mirandaErrorRecovery', { 
                          detail: { timestamp: Date.now() } 
                        }));
                      } catch (e) {
                        console.error('Failed to dispatch recovery event:', e);
                      }
                    }}
                  >
                    <Suspense fallback={<div className="p-8 text-center">Loading voice assistant...</div>}>
                      <LarkChat />
                    </Suspense>
                  </MirandaErrorBoundary>
                </ErrorBoundary>
              </TabsContent>

              <TabsContent value="miranda" className="focus-visible:outline-none focus-visible:ring-0 m-0 animate-in fade-in-50 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=active]:duration-300">
                <Suspense fallback={<div className="p-8 text-center">Loading Miranda Rights...</div>}>
                  <MirandaRights />
                </Suspense>
              </TabsContent>

              <TabsContent value="statutes" className="focus-visible:outline-none focus-visible:ring-0 m-0 animate-in fade-in-50 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=active]:duration-300">
                <Suspense fallback={<div className="p-8 text-center">Loading Statutes...</div>}>
                  <RSCodes />
                </Suspense>
              </TabsContent>

              <TabsContent value="threats" className="focus-visible:outline-none focus-visible:ring-0 m-0 animate-in fade-in-50 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=active]:duration-300">
                <Suspense fallback={<div className="p-8 text-center">Loading Threat Detection...</div>}>
                  <ThreatDetection />
                </Suspense>
              </TabsContent>
              
              <TabsContent value="tools" className="focus-visible:outline-none focus-visible:ring-0 m-0 animate-in fade-in-50 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=active]:duration-300">
                <Suspense fallback={<div className="p-8 text-center">Loading Tools...</div>}>
                  <Tools />
                </Suspense>
              </TabsContent>
              
              <TabsContent value="settings" className="focus-visible:outline-none focus-visible:ring-0 m-0 animate-in fade-in-50 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=active]:duration-300">
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <Suspense fallback={<div className="p-4 text-center">Loading Settings...</div>}>
                        <Settings />
                      </Suspense>
                    </div>
                    <div className="space-y-6">
                      <div className="fluid-card rounded-lg border border-[rgba(255,255,255,0.3)] shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-border/60 bg-muted/30">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <VolumeUpIcon className="h-5 w-5 text-primary" />
                            Voice System Test
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">Test the LiveKit voice synthesis system</p>
                        </div>
                        <div className="p-4">
                          <Suspense fallback={<div className="p-4 text-center">Loading LiveKit Test...</div>}>
                            <LiveKitRealtimeVoiceTest />
                          </Suspense>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              

            </div>
          </Tabs>
        </main>

        {/* Status indicators removed as requested */}

        <footer className="mt-8 text-center text-xs text-muted-foreground pt-6 border-t border-border">
          <p className="flex items-center justify-center gap-1 font-medium">
            <span>© 2025 Zooner Enterprises</span>
            <span className="text-border/80">•</span>
            <span>All Rights Reserved</span>
          </p>
        </footer>
      </div>
      </div>
    </LiveKitVoiceProvider>
  );
}

export default App;
