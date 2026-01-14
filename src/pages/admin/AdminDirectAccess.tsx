import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * TESTING ONLY - Direct Admin Access
 * This page bypasses authentication for development/testing purposes.
 * REMOVE THIS PAGE BEFORE PRODUCTION DEPLOYMENT!
 */
const AdminDirectAccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Store a test admin session flag
    localStorage.setItem('testAdminAccess', 'true');
    localStorage.setItem('testAdminEmail', 'adilahmadip@gmail.com');
  }, []);

  const handleEnterDashboard = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-amber-300 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-amber-600" />
          </div>
          <CardTitle className="text-2xl">Admin Test Access</CardTitle>
          <CardDescription className="text-base">
            Direct access to admin dashboard for testing purposes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Warning Banner */}
          <div className="bg-amber-100 border border-amber-300 rounded-lg p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-semibold">Development Mode Only</p>
              <p className="mt-1">This bypasses authentication. Remove before production!</p>
            </div>
          </div>

          {/* Admin Info */}
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <p className="text-sm text-muted-foreground">Accessing as:</p>
            <p className="font-mono text-sm font-medium">adilahmadip@gmail.com</p>
            <p className="text-xs text-muted-foreground">Role: Super Admin</p>
          </div>

          {/* Enter Button */}
          <Button 
            onClick={handleEnterDashboard} 
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
          >
            Enter Admin Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Session will persist until you clear browser storage
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDirectAccess;
