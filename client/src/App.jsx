import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "./components/ui/textarea";
import { useAccount, useContractRead, useContractWrite } from "wagmi";
import { contractABI, contractAddress } from "./lib/contract";
import { toast } from "sonner";
import { useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "./lib/utils";

function App() {
  const { isConnected, address, status: connectionStatus } = useAccount();
  const { data, status } = useContractRead({
    abi: contractABI,
    address: contractAddress,
    functionName: "getAddresses",
    enabled: isConnected,
  });
  console.log(data, status);
  if (
    status === "loading" ||
    connectionStatus === "disconnected" ||
    connectionStatus === "connecting" ||
    connectionStatus === "reconnecting"
  )
    return "Loading...";
  return (
    <main className="p-10">
      {data.includes(address) ? (
        <>
          <Main />
          <RecentTransactions isConnected={data.includes(address)} />
        </>
      ) : (
        <div className="flex h-[80vh] w-full items-center justify-center flex-col gap-6">
          <h3 className="font-bold text-5xl">Sorry, Access Denied.</h3>
          <p>
            Please contact your superior and let them know to add you as a
            collaborator.
          </p>
        </div>
      )}
    </main>
  );
}

const Main = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const date = Date.now();
  const { writeAsync } = useContractWrite({
    abi: contractABI,
    address: contractAddress,
    functionName: "addTransaction",
    args: [name, description, date, amount],
    onSuccess: () => {
      toast.dismiss("loading");
      toast.success("Succesfully recieved your payment.");
      window.location.reload();
    },
    onError: () => {
      toast.dismiss("loading");
      toast.error("Payment failed! Please try again.");
    },
  });

  const { writeAsync: writeAsyncExpense } = useContractWrite({
    abi: contractABI,
    address: contractAddress,
    functionName: "addTransaction",
    args: [name, description, date, -amount],
    onSuccess: () => {
      toast.dismiss("loading");
      toast.success("Succesfully recieved your payment.");
      window.location.reload();
    },
    onError: () => {
      toast.dismiss("loading");
      toast.error("Payment failed! Please try again.");
    },
  });
  // console.log(data, status);
  return (
    <Tabs defaultValue="income" className=" px-24 ">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="income">Income</TabsTrigger>
        <TabsTrigger value="expense">Expense</TabsTrigger>
      </TabsList>
      <TabsContent value="income">
        <Card>
          <CardHeader>
            <CardTitle>Income</CardTitle>
            <CardDescription>Enter your income here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(event) => setName(event.currentTarget.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.currentTarget.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="Cost">Cost</Label>
              <Input
                id="cost"
                type="number"
                value={amount}
                onChange={(event) => setAmount(event.currentTarget.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => {
                toast.loading("Adding your income...", { id: "loading" });
                writeAsync();
              }}
            >
              Add Income
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="expense">
        <Card>
          <CardHeader>
            <CardTitle>Expense</CardTitle>
            <CardDescription>Enter your expense here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(event) => setName(event.currentTarget.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.currentTarget.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="Cost">Cost</Label>
              <Input
                id="cost"
                type="number"
                value={amount}
                onChange={(event) => setAmount(event.currentTarget.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => {
                toast.loading("Adding your expense...", { id: "loading" });
                writeAsyncExpense();
              }}
            >
              Add Expense
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

const RecentTransactions = ({ isConnected }) => {
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [click, setClick] = useState(false);

  const { data, status } = useContractRead({
    abi: contractABI,
    address: contractAddress,
    functionName: "getRecentTransactions",
    enabled: isConnected,
  });
  const { data: allTransactionsData, status: allTransactionsStatus } =
    useContractRead({
      abi: contractABI,
      address: contractAddress,
      functionName: "getTransactions",
      args: [to, from],
      enabled: click,
      onSuccess: () => setClick(false),
    });
  // console.log(data);
  console.log(allTransactionsData);
  return (
    <div className="px-24 py-10">
      <div className="flex items-center justify-between py-2">
        <h4>Recent Transactions</h4>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">View All</Button>
          </SheetTrigger>
          <SheetContent className="">
            <SheetHeader>
              <SheetTitle>All Transactions</SheetTitle>
              <SheetDescription>View all of the transactions.</SheetDescription>
            </SheetHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <Label htmlFor="from" className="text-left">
                From
              </Label>
              <Label htmlFor="to" className="text-left">
                To
              </Label>
              <div className="grid grid-cols-4 items-center gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[150px] justify-start text-left font-normal",
                        !to && "text-muted-foreground"
                      )}
                    >
                      {to ? (
                        format(to, "PPP")
                      ) : (
                        <CalendarIcon className="mr-2 h-4 w-4" />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={to}
                      onSelect={setTo}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[150px] justify-start text-left font-normal",
                        !from && "text-muted-foreground"
                      )}
                    >
                      {from ? (
                        format(from, "PPP")
                      ) : (
                        <CalendarIcon className="mr-2 h-4 w-4" />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={from}
                      onSelect={setFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <Button className="w-full" onClick={() => setClick(true)}>
              Search
            </Button>
            <div className="flex flex-col text-wrap gap-8 py-8 ">
              {allTransactionsData.map((transaction, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <CardTitle>{transaction.name}</CardTitle>
                    <CardDescription>{transaction.description}</CardDescription>
                    <div className="py-2">
                      Amount :{" "}
                      <span
                        className={
                          Math.sign(Number(transaction.amount)) === -1
                            ? "text-red-500"
                            : "text-green-500"
                        }
                      >
                        {Math.sign(Number(transaction.amount)) === 1 && "+"}
                        {Number(transaction.amount)}
                      </span>
                    </div>
                    <div className="py-2">
                      Date :{" "}
                      {new Date(Number(transaction.createdAt)).toLocaleString()}
                    </div>
                    <p className="text-xs text-foreground/50">
                      {transaction.owner}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex flex-col gap-2">
        {data === undefined || data.length === 0 ? (
          <p className="py-2">No transactions yet.</p>
        ) : (
          data.map((transaction, index) => (
            <Card key={index}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-bold">{transaction.name}</p>
                  <p>{transaction.description}</p>
                </div>
                <div>
                  <p>
                    {new Date(Number(transaction.createdAt)).toLocaleString()}
                  </p>
                  <p
                    className={
                      Math.sign(Number(transaction.amount)) === -1
                        ? "text-red-500"
                        : "text-green-500"
                    }
                  >
                    {Math.sign(Number(transaction.amount)) === 1 && "+"}
                    {Number(transaction.amount)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
