import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

if (PUBLIC_KEY) {
  emailjs.init(PUBLIC_KEY);
}

export interface QuoteRequestParams {
  from_name: string;
  from_email: string;
  from_phone: string;
  items_summary: string;
}

export async function sendQuoteRequest(params: QuoteRequestParams): Promise<void> {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    throw new Error(
      'EmailJS is not configured. Set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID and VITE_EMAILJS_PUBLIC_KEY (see .env.example).'
    );
  }
  await emailjs.send(SERVICE_ID, TEMPLATE_ID, { ...params });
}
