export const env = {
  googleClientId: process.env.GOOGLE_CLIENT_ID as string,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN as string,
  googleUser: process.env.GOOGLE_USER as string,
  nextPublicBaseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  rajaOngkirApiKey: process.env.RAJA_ONGKIR_API_KEY,
  midtransServerKey: process.env.MIDTRANS_SERVER_KEY!,
  midtransPublicClientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
};
