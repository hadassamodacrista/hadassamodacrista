import { MercadoPagoConfig, Preference } from "mercadopago";

export async function createCheckoutPreference(params: {
  accessToken: string;
  productName: string;
  productId: string;
  price: number;
  quantity?: number;
  imageUrl?: string;
  siteUrl: string;
}) {
  const client = new MercadoPagoConfig({ accessToken: params.accessToken });
  const preference = new Preference(client);

  const result = await preference.create({
    body: {
      items: [
        {
          id: params.productId,
          title: params.productName,
          quantity: params.quantity ?? 1,
          currency_id: "BRL",
          unit_price: params.price,
          picture_url: params.imageUrl
        }
      ],
      external_reference: params.productId,
      back_urls: {
        success: `${params.siteUrl}/pagamento/sucesso`,
        pending: `${params.siteUrl}/pagamento/pendente`,
        failure: `${params.siteUrl}/pagamento/erro`
      },
      // O Mercado Pago só aceita "auto_return" quando as back_urls são https públicas
      // (não funciona com localhost). Em produção (site com https) isso é ativado normalmente.
      ...(params.siteUrl.startsWith("https://") ? { auto_return: "approved" as const } : {})
    }
  });

  return result;
}
