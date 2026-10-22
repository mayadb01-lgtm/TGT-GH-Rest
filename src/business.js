// 🏨 Is business ki pehchaan: invoice, banquet bill aur WhatsApp message mein yahi dikhta hai.
// Har business (Ashirvad / TGT / ishivadahivel) ki repo mein SIRF ye file alag hai — baaki code ek jaisa.
// Khaali ("") chhodi cheez invoice par nahi chhapti. TODO: owner se pata, phone, GSTIN, logo lekar bharna hai.
const NAME = import.meta.env.VITE_REACT_APP_BUSINESS_NAME || "UHU";
export const BUSINESS = {
  name: NAME,
  shortName: NAME,
  city: "",
  tagline: "",
  address: "",
  phones: "",
  gstin: "",
  state: "",
  stateCode: "",
  logo: "", // jaise "/logo.png" (file public/ folder mein)
};

export default BUSINESS;
