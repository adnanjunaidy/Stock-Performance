// pages/index.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import InvestmentCalculator from "@/components/InvestmentCalculator";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <InvestmentCalculator />
    </QueryClientProvider>
  );
}
