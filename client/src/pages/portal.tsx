import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, LogOut, Shield } from "lucide-react";

export default function Portal() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You need to log in to access the portal. Redirecting...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-headings font-bold text-4xl md:text-5xl mb-2">
                  Portal Dashboard
                </h1>
                <p className="text-lg text-muted-foreground">
                  Welcome back, {user.firstName || user.email}
                </p>
              </div>
              <Button
                variant="outline"
                asChild
                data-testid="button-logout"
              >
                <a href="/api/logout" className="inline-flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </a>
              </Button>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Name</p>
                    <p className="font-medium" data-testid="text-user-name">
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.firstName || user.lastName || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-medium" data-testid="text-user-email">
                      {user.email || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Role</p>
                    <Badge variant="secondary" data-testid="badge-user-role">
                      {user.role || "user"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Member Since</p>
                    <p className="font-medium" data-testid="text-user-joined">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Access Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Your current role determines what features and data you can access.
                </p>
                <Badge variant="outline" className="capitalize">
                  {user.role || "Standard User"}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                  <a href="/events" data-testid="button-view-events">
                    <span className="font-semibold">View Events</span>
                    <span className="text-sm text-muted-foreground">Browse upcoming events</span>
                  </a>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                  <a href="/volunteer" data-testid="button-volunteer">
                    <span className="font-semibold">Volunteer</span>
                    <span className="text-sm text-muted-foreground">Sign up to help</span>
                  </a>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                  <a href="/donate" data-testid="button-donate">
                    <span className="font-semibold">Donate</span>
                    <span className="text-sm text-muted-foreground">Support our mission</span>
                  </a>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                  <a href="/news" data-testid="button-news">
                    <span className="font-semibold">Latest News</span>
                    <span className="text-sm text-muted-foreground">Read updates</span>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Admin Note */}
          {user.role === "admin" || user.role === "board_member" && (
            <Card className="mt-6 border-primary/50">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> As an {user.role}, you have access to additional management features. These would be implemented in future phases.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
