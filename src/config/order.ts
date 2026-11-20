// TODO(rozhodnutí): Sami has not decided between "request" and "binding" yet.
// "request" is the placeholder because it commits the customer to nothing.
export const ORDER_MODE: 'request' | 'binding' = 'request';

/** How the customer pays: by bank transfer, the QR Platba code sent by
 *  e-mail (Sami, November 2026: a box for paying by QR code). */
export const paymentMethods = [{ id: 'qr', name: 'Převodem přes QR kód', note: 'QR kód pro platbu vám pošleme e-mailem.' }];
