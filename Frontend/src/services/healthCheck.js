// src/services/healthCheck.js

import axios from "axios";

export const activateServices = async () => {
  try {
    const restRes = await axios.get(
      "https://option-chain-d.onrender.com/api/health"
    );
    console.log("[REST API] Service Activated:", restRes.data);

    const socketRes = await axios.get(
      "https://option-chain-d-new-app.onrender.com/health"
    );
    console.log("[Socket API] Service Activated:", socketRes.data);
  } catch (error) {
    console.error("[Service Activation] Error:", error.message);
  }
};
