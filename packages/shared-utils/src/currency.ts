export const parseCurrencyString = (value: string): number => {
  const cleaned = value.replace(/\./g, "").replace(",", ".");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

export const formatValue = (value: string | number) => {
    const intValue = typeof value == "string" ? parseInt(value, 10) : value;
    const formatted =
      typeof value == "string"
        ? (intValue / 100).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : intValue.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

    return formatted;
  };
