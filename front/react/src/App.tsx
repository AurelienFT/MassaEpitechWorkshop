import { useState, useEffect } from "react";
import { IClient, ClientFactory, bytesToStr, DefaultProviderUrls, CHAIN_ID } from "@massalabs/massa-web3";

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

    const newClient = await ClientFactory.createDefaultClient(DefaultProviderUrls.BUILDNET, CHAIN_ID.BuildNet);

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
