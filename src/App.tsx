import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppStateProvider } from '@/hooks/use-app-state'
import Index from './pages/Index'
import Links from './pages/Links'
import Collections from './pages/Collections'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'

const App = () => (
  <AppStateProvider>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/links" element={<Links />} />
            <Route path="/collections" element={<Collections />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </AppStateProvider>
)

export default App
