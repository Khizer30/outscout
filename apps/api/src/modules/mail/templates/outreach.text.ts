interface Props {
  body: string;
  signature: string | null;
}

export default function generateOutreachText({ body, signature }: Props): string {
  return signature ? `${body}\n\n${signature}` : body;
}
