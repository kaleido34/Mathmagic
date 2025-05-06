import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ui/theme-provider";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Topics from "@/pages/topics";
import Games from "@/pages/games";
import Progress from "@/pages/progress";
import ModuleDetail from "@/pages/module-detail";
import { Helmet } from "react-helmet-async";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/topics" component={Topics} />
      <Route path="/games" component={Games} />
      <Route path="/progress" component={Progress} />
      <Route path="/modules/:slug" component={ModuleDetail} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <Helmet defaultTitle="MathJoy - Fun Math Learning for Grades 6-8" titleTemplate="%s | MathJoy">
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="Interactive math lessons, games, and puzzles designed to reduce anxiety and make learning fun for students in grades 6-8." />
        </Helmet>
        <Router />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
