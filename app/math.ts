export function calculateSpent(amount: number, transactions: number[]): number {
  const spendable = transactions.reduce(
    (acc, transaction) => (acc += transaction),
    amount
  );

  return roundToHundredth(amount - spendable);
}

export function calculateHeight(
  totalHeight: number,
  spendable: number,
  spent: number
): number {
  return Math.min(totalHeight - (1 / (spendable / spent)) * 50, 50);
}

export function roundToHundredth(x: number): number {
  return Math.round(x * 100) / 100;
}
