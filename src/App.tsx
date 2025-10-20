import { AppRouter } from "@/config/routes/index.route";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <>
      <AppRouter />
      <Toaster />
    </>
  );
}

export default App;
