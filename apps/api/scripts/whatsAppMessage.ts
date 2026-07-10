// https://wa.me/<phone>?text=<url-encoded-message>

function openWhatsApp(phone: string, message: string): string {
  // Strip everything except digits
  const cleaned = phone.replace(/\D/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encoded}`;
}

// Usage
console.info(openWhatsApp("+92 304 5149450", "Hi ABC Restaurant! I'd love to discuss a collaboration."));
