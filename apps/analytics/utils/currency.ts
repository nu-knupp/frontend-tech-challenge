export function formatValue(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return `R$ ${num.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}
