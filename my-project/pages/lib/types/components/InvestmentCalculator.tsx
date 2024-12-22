// components/InvestmentCalculator.tsx
"use client"; // If you’re on Next.js 13+ and using the app router

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { calculatorSchema, CalculatorInput } from "@/types/schemas";
import { cryptoIds, getCryptoPrice } from "@/lib/api";

// Shadcn/ui or similar components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Your crypto dropdown data
const cryptocurrencies = [
  { value: "BTC", label: "Bitcoin (BTC)" },
  { value: "ETH", label: "Ethereum (ETH)" },
  { value: "USDT", label: "Tether (USDT)" },
  { value: "BNB", label: "BNB" },
  { value: "XRP", label: "XRP" },
  { value: "USDC", label: "USD Coin (USDC)" },
  { value: "SOL", label: "Solana (SOL)" },
  { value: "ADA", label: "Cardano (ADA)" },
  { value: "DOGE", label: "Dogecoin (DOGE)" },
  { value: "TRX", label: "TRON (TRX)" },
  { value: "TON", label: "Toncoin (TON)" },
  { value: "DAI", label: "Dai (DAI)" },
  { value: "MATIC", label: "Polygon (MATIC)" },
  { value: "DOT", label: "Polkadot (DOT)" },
  { value: "LTC", label: "Litecoin (LTC)" },
  { value: "BCH", label: "Bitcoin Cash (BCH)" },
  { value: "SHIB", label: "Shiba Inu (SHIB)" },
  { value: "AVAX", label: "Avalanche (AVAX)" },
  { value: "LINK", label: "Chainlink (LINK)" },
  { value: "XLM", label: "Stellar (XLM)" },
  { value: "UNI", label: "Uniswap (UNI)" },
  { value: "ATOM", label: "Cosmos (ATOM)" },
  { value: "XMR", label: "Monero (XMR)" },
  { value: "OKB", label: "OKB" },
  { value: "ETC", label: "Ethereum Classic (ETC)" },
];

export default function InvestmentCalculator() {
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const [result, setResult] = useState<{
    totalInvestment: number;
    takeHome: number;
    profitLoss: number;
    percentageChange: number;
  } | null>(null);

  // React Hook Form setup
  const form = useForm<CalculatorInput>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      currency: "USD",
      crypto: "",
      investment: "",
      buyPrice: "",
      sellPrice: "",
      investmentFee: "0",
      exitFee: "0",
    },
  });

  // React Query to fetch currentPrice
  const { data: currentPrice, isLoading: isPriceLoading } = useQuery({
    queryKey: [
      `/api/crypto/${selectedCrypto ? cryptoIds[selectedCrypto as keyof typeof cryptoIds] : ""}`
    ],
    queryFn: () =>
      selectedCrypto && selectedCrypto !== "OTHER"
        ? getCryptoPrice(cryptoIds[selectedCrypto as keyof typeof cryptoIds])
        : null,
    enabled: !!selectedCrypto && selectedCrypto !== "OTHER",
  });

  // Update buy/sell prices automatically when the crypto changes
  // and we have a currentPrice from the API.
  useEffect(() => {
    if (currentPrice && selectedCrypto) {
      form.setValue("buyPrice", currentPrice.toString());
      form.setValue("sellPrice", currentPrice.toString());
    }
  }, [currentPrice, selectedCrypto, form]);

  // Form submit handler
  const onSubmit = (data: CalculatorInput) => {
    const investment = parseFloat(data.investment);
    const buyPrice = parseFloat(data.buyPrice);
    const sellPrice = parseFloat(data.sellPrice);
    const investmentFee = parseFloat(data.investmentFee);
    const exitFee = parseFloat(data.exitFee);

    const totalInvestment = investment + investmentFee;
    const grossProfit = (sellPrice - buyPrice) * (investment / buyPrice);
    const takeHome = grossProfit - exitFee;
    const percentageChange = ((sellPrice - buyPrice) / buyPrice) * 100;

    setResult({
      totalInvestment,
      takeHome,
      profitLoss: grossProfit,
      percentageChange,
    });
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-cyan-400 to-pink-300 bg-clip-text text-transparent">
              Investment Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Currency */}
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Choose a currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            {/* Add more fiat currencies if needed */}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  {/* Cryptocurrency */}
                  <FormField
                    control={form.control}
                    name="crypto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Choose cryptocurrency</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedCrypto(value);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select cryptocurrency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cryptocurrencies.map((crypto) => (
                              <SelectItem key={crypto.value} value={crypto.value}>
                                {crypto.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  {/* Investment */}
                  <FormField
                    control={form.control}
                    name="investment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Investment</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="any"
                            placeholder="0"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Buy Price */}
                  <FormField
                    control={form.control}
                    name="buyPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Buy Price
                          {isPriceLoading && (
                            <Loader2 className="inline ml-2 h-4 w-4 animate-spin" />
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="any"
                            placeholder="0"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Sell Price */}
                  <FormField
                    control={form.control}
                    name="sellPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sell Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="any"
                            placeholder="0"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Investment Fee */}
                  <FormField
                    control={form.control}
                    name="investmentFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Investment Fee</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="any"
                            placeholder="0"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Exit Fee */}
                  <FormField
                    control={form.control}
                    name="exitFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exit Fee</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="any"
                            placeholder="0"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-400 to-pink-300 hover:from-cyan-500 hover:to-pink-400 text-white shadow-lg transition-all duration-200 hover:shadow-xl"
                >
                  Calculate
                </Button>
              </form>
            </Form>

            {/* Results */}
            {result && (
              <div className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Investment Outcome</h3>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Profit/Loss</span>
                            <span
                              className={
                                result.profitLoss >= 0 ? "text-green-500" : "text-red-500"
                              }
                            >
                              ${result.profitLoss.toFixed(2)} (
                              {result.percentageChange.toFixed(2)}%)
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Investment</span>
                            <span>${result.totalInvestment.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Take-Home</span>
                            <span>${result.takeHome.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
