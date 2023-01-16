import { COIN_AMOUNTS } from "../constants/coins";

export const isValidCoin = (coin: number) => COIN_AMOUNTS.includes(coin);

export const convertToChange = (amount: number, coinAmounts: number[]) => {
  const change: number[] = [];
  for (let i = coinAmounts.length - 1; i >= 0; i--) {
    const coin = coinAmounts[i];
    while (amount >= coin) {
      change.push(coin);
      amount -= coin;
    }
  }
  if (amount > 0) {
    console.error(
      `Critical error. Could not convert all user amount to change`
    );
  }
  return change;
};
