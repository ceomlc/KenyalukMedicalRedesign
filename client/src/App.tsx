import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import About from "@/pages/about";
import Programs from "@/pages/programs";
import ProgramDetail from "@/pages/program-detail";
import Events from "@/pages/events";
import Donate from "@/pages/donate";
import Volunteer from "@/pages/volunteer";
import Sponsor from "@/pages/sponsor";
import News from "@/pages/news";
import Contact from "@/pages/contact";
import Portal from "@/pages/portal";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/about" component={About} />
          <Route path="/programs" component={Programs} />
          <Route path="/programs/:slug" component={ProgramDetail} />
          <Route path="/events" component={Events} />
          <Route path="/donate" component={Donate} />
          <Route path="/volunteer" component={Volunteer} />
          <Route path="/sponsor" component={Sponsor} />
          <Route path="/news" component={News} />
          <Route path="/contact" component={Contact} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/programs" component={Programs} />
          <Route path="/programs/:slug" component={ProgramDetail} />
          <Route path="/events" component={Events} />
          <Route path="/donate" component={Donate} />
          <Route path="/volunteer" component={Volunteer} />
          <Route path="/sponsor" component={Sponsor} />
          <Route path="/news" component={News} />
          <Route path="/contact" component={Contact} />
          <Route path="/portal" component={Portal} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
