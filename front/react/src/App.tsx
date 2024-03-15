import { useState, useEffect } from "react";
import { IClient, ClientFactory, IEvent, bytesToStr } from "@massalabs/massa-web3";
import { providers } from "@massalabs/wallet-provider";
import { EventListener } from "./utils/pollEvent";

const CONTRACT_ADDRESS =
  "AS12cUgpyh56LW5xmDy7BA5xxKoyCoToRy919Fps8Uhcy8P3AEHoy";

export default function AutonomousPriceInteraction() {
  const [scAddress, setSCAddress] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [client, setClient] = useState<IClient | null>(null);
  const [price, setPrice] = useState<string>("");
  const [fetchRoutine, setFetchRoutine] = useState<NodeJS.Timeout | null>(null);


  useEffect(() => {
    if (!client) return;
    if (scAddress == "") return;
    if (fetchRoutine) {
      clearInterval(fetchRoutine);
      setFetchRoutine(null);
    };
    const routine = setInterval(async () => {
      const response = await client.smartContracts().readSmartContract({
        targetAddress: scAddress,
        callerAddress: "AU12TJEg3A6XZZFEdimHR8yqJdUfrsSpxNKdRHbY9NjKMn4MXajyV",
        targetFunction: "getPrice",
        parameter: [],
        maxGas: BigInt(4000000),
      });
      const price = bytesToStr(response.returnValue);
      setPrice(parseInt(price).toString());
    }, 1000);
    setFetchRoutine(routine);
    return () => clearInterval(routine);
  }, [client, scAddress]);

  async function initProvider() {
    setErrorMessage("");

    const allProviders = await providers();

    if (!allProviders || allProviders.length === 0) {
      throw new Error("No providers available");
    }

    const massastationProvider = allProviders.find(
      (provider) => provider.name() === "MASSASTATION"
    );

    if (!massastationProvider) {
      setErrorMessage("MASSASTATION provider not found");
      return;
    }

    const accounts = await massastationProvider.accounts();
    if (accounts.length === 0) {
      setErrorMessage("No accounts found");
      return;
    }

    const account = accounts[0];

    const newClient = await ClientFactory.fromWalletProvider(
      massastationProvider,
      account
    );

    setClient(newClient);
  }

  useEffect(() => {
    initProvider();

    return () => {
    };
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen gap-4">
      {errorMessage && (
        <div className="alert alert-error shadow-lg w-auto absolute top-10 animate-slideFromTop">
          <span>{errorMessage}</span>
          <div>
            <button className="btn btn-sm btn-primary" onClick={initProvider}>
              Reload
            </button>
          </div>
        </div>
      )}
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Massa Autonomous Price</div>
            {/*Input to place the scAddress following the style*/}
          <input  className="input" type="text" placeholder="Enter the scAddress" value={scAddress} onChange={(e) => setSCAddress(e.target.value)} />
          <div className="stat-value text-secondary">
            {price ? (
              `${price} MAS`
            ) : (
              <p className="w-full ">
                Fetching price
                <span className="loading loading-ring loading-md ml-3"></span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
