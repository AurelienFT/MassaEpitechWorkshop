import {
  callerHasWriteAccess,
  generateEvent,
  Context,
  sendMessage,
  Storage,
  unsafeRandom,
} from '@massalabs/massa-as-sdk';
import { stringToBytes, u64ToBytes } from '@massalabs/as-types';
import { currentPeriod } from '@massalabs/massa-as-sdk/assembly/std/context';

// Differentes constantes pour le contrat
const PRICE_KEY = 'PRICE_KEY';
const MAX_PRICE = 20;
const COUNTER_KEY = 'COUNTER_KEY';

// Fonction de construction du contrat. Elle est appelé automatiquement lors du déploiement du contrat.
// Cette fonction comme les autres prend en paramètre un tableau de byte et retourne un tableau de byte.
// Pour renvoyer des types de données plus complexes, il faut les convertir en tableau de byte via notre librarie et
// notre structure de données `Args`.
export function constructor(_: StaticArray<u8>): StaticArray<u8> {
  // This line is important. It ensure that this function can't be called in the future.
  // If you remove this check someone could call your constructor function and reset your SC.
  assert(callerHasWriteAccess(), 'Caller is not allowed');

  Storage.set(COUNTER_KEY, "0");

  // Appel de la fonction pour mettre à jour le prix du contrat.
  updatePrice(new StaticArray<u8>(0));
  return [];
}

// Fonction permettant d'appeler la fonction updatePrice dans le futur.
// A NE PAS TOUCHER
export function sendFutureOperation(): void {
  const counter = Storage.get(COUNTER_KEY);
  const counterValue = parseInt(counter);
  if (counterValue >= 10) {
    return;
  }
  Storage.set(COUNTER_KEY, (counterValue + 1).toString());
  const address = Context.callee();
  const functionName = 'updatePrice';
  const validityStartPeriod = currentPeriod() + 1;
  const validityStartThread = 0 as u8;
  const validityEndPeriod = validityStartPeriod;
  const validityEndThread = 31 as u8;

  const maxGas = 500_000_000; // gas for smart contract execution
  const rawFee = 0;
  const coins = 0;

  // Send the message
  sendMessage(
    address,
    functionName,
    validityStartPeriod,
    validityStartThread,
    validityEndPeriod,
    validityEndThread,
    maxGas,
    rawFee,
    coins,
    [],
  );

  generateEvent(
    `next update planned on period ${validityStartPeriod.toString()} thread: ${validityStartThread.toString()}`,
  );
}

// Fonction permettant de mettre à jour le prix du contrat.
export function updatePrice(_: StaticArray<u8>): void {
  //ICI ETAPE2/3
}

// Fonction permettant de récupérer le prix actuel du contrat.
export function getPrice(_: StaticArray<u8>): StaticArray<u8> {
  if (Storage.has(PRICE_KEY)) {
    return stringToBytes(Storage.get(PRICE_KEY));
  } else {
    return stringToBytes("0");
  };
}
