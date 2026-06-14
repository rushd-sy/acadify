import { SidebarProvider } from './components/ui/sidebar';
import SharedLayout from './features/SharedLayout/components/SharedLayout';
function App() {
  return (
    <SidebarProvider>
      <SharedLayout />
    </SidebarProvider>
  );
}

export default App;
