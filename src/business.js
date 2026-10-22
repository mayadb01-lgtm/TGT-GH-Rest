// 🏨 Is business ki pehchaan: invoice, banquet bill aur WhatsApp message mein yahi dikhta hai.
// Har business (Ashirvad / TGT / ishivadahivel) ki repo mein SIRF ye file alag hai — baaki code ek jaisa.
// Khaali ("") chhodi cheez invoice par nahi chhapti.
export const BUSINESS = {
  name: "THE GRAND TAPI™",
  shortName: "The Grand Tapi",
  city: "Valthan",
  tagline: "Restaurant | Guest House | Party Plot",
  address: "Nr. Kosmadi Patiya, Kamrej-Kadodara Road, NH-48, Valthan, Tal. Kamrej, Dist. Surat, Gujarat",
  phones: "95587 75668, 97730 71358",
  gstin: "24OXYPS3956N1ZW",
  state: "Gujarat",
  stateCode: "24",
  logo: "/tgt-logo.png",
  website: "www.thegrandtapi.com",
  // Invoice ke neeche "Bank details" (khaali ho to nahi chhapta)
  bank: { name: "ICICI Bank", account: "045905010108", ifsc: "ICIC0000459" },
};

export default BUSINESS;
