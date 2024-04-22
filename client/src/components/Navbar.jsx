import { useAccount, useConnect, useDisconnect } from "wagmi";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";

const Navbar = () => {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  // console.log(address, data, connectors, error);
  return (
    <nav className="py-6 px-10 flex justify-between items-center">
      <h1 className="font-bold text-xl">Book-Keeping</h1>
      <div className="flex gap-4">
        <ModeToggle />
        <Button
          variant="outline"
          onClick={() => {
            if (isConnected) {
              disconnect();
            } else {
              connect({ connector: connectors[0], chainId: 31337 });
            }
          }}
        >
          {isConnecting || (isReconnecting && " Connecting....")}
          {isConnected ? address : "Connect"}
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
