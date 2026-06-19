export const VAT_REGEX = /^BE\d{10}$/;

export function normalizeVatNumber(value: string): string {
  let cleaned = value.replace(/[\s.\-]/g, "").toUpperCase();

  if (/^\d{10}$/.test(cleaned)) {
    cleaned = `BE${cleaned}`;
  } else if (cleaned.startsWith("BE")) {
    cleaned = `BE${cleaned.slice(2).replace(/\D/g, "").slice(0, 10)}`;
  } else {
    cleaned = cleaned.replace(/\D/g, "");
    if (cleaned.length === 10) {
      cleaned = `BE${cleaned}`;
    }
  }

  return cleaned;
}

export function validateBelgianVat(value: string): string | null {
  const normalized = normalizeVatNumber(value);
  if (!VAT_REGEX.test(normalized)) {
    return "VAT number must be in format BE0000000000";
  }
  return null;
}

export function getVatDigitCount(value: string): number {
  const normalized = normalizeVatNumber(value);
  if (!normalized.startsWith("BE")) return 0;
  return normalized.slice(2).length;
}

export function isEmailExistsError(message: string): boolean {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("email") &&
    (normalized.includes("exist") ||
      normalized.includes("already") ||
      normalized.includes("registered") ||
      normalized.includes("in use"))
  );
}

export function isVatRelatedError(message: string): boolean {
  const normalized = message.toLowerCase();
  return normalized.includes("vat") || normalized.includes("vies");
}
