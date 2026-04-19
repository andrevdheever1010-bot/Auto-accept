import crypto from 'crypto';

const SANDBOX = process.env.PAYFAST_SANDBOX === 'true';
const MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID!;
const MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY!;
const PASSPHRASE = process.env.PAYFAST_PASSPHRASE || '';

export const PAYFAST_URL = SANDBOX
  ? 'https://sandbox.payfast.co.za/eng/process'
  : 'https://www.payfast.co.za/eng/process';

export interface PayFastData {
  orderId: string;
  orderNumber: string;
  amount: number;
  itemName: string;
  customerName: string;
  customerEmail: string;
  baseUrl: string;
}

export function buildPayFastParams(data: PayFastData): Record<string, string> {
  const params: Record<string, string> = {
    merchant_id: MERCHANT_ID,
    merchant_key: MERCHANT_KEY,
    return_url: `${data.baseUrl}/order/success?order=${data.orderNumber}`,
    cancel_url: `${data.baseUrl}/order/cancelled?order=${data.orderNumber}`,
    notify_url: `${data.baseUrl}/api/payfast/notify`,
    name_first: data.customerName.split(' ')[0] || data.customerName,
    name_last: data.customerName.split(' ').slice(1).join(' ') || '',
    email_address: data.customerEmail,
    m_payment_id: data.orderId,
    amount: data.amount.toFixed(2),
    item_name: data.itemName,
  };

  params.signature = generateSignature(params);
  return params;
}

export function generateSignature(
  params: Record<string, string>,
  passphrase?: string
): string {
  const entries = Object.entries(params)
    .filter(([k]) => k !== 'signature')
    .sort(([a], [b]) => a.localeCompare(b));

  let queryString = entries
    .map(([k, v]) => `${k}=${encodeURIComponent(v.trim()).replace(/%20/g, '+')}`)
    .join('&');

  const ph = passphrase ?? PASSPHRASE;
  if (ph) queryString += `&passphrase=${encodeURIComponent(ph.trim()).replace(/%20/g, '+')}`;

  return crypto.createHash('md5').update(queryString).digest('hex');
}

export async function verifyPayFastITN(params: Record<string, string>): Promise<boolean> {
  // 1. Verify signature
  const receivedSig = params.payment_status === 'COMPLETE' ? params.signature : params.signature;
  const { signature: _sig, ...rest } = params;
  const calculatedSig = generateSignature(rest);
  if (calculatedSig !== receivedSig) return false;

  // 2. Verify with PayFast server
  try {
    const host = SANDBOX ? 'sandbox.payfast.co.za' : 'www.payfast.co.za';
    const body = Object.entries(params)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');

    const res = await fetch(`https://${host}/eng/query/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const text = await res.text();
    return text.trim() === 'VALID';
  } catch {
    return false;
  }
}
