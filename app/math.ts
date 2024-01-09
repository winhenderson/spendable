export function calculateSpent(amount: number, transactions: number[]): number {
  const spendable = transactions.reduce(
    (acc, transaction) => (acc += transaction),
    amount
  );

  return Math.round((amount - spendable) * 100) / 100;
}

export function calculateHeight(
  totalHeight: number,
  spendable: number,
  spent: number
): number {
  return Math.min(totalHeight - (1 / (spendable / spent)) * 50, 50);
}
