export function calculateSpent(amount: number, transactions: number[]): number {
  const spendable = transactions.reduce(
    (acc, transaction) => (acc += transaction),
    amount
  );

  return Math.round((amount - spendable) * 100) / 100;
}
