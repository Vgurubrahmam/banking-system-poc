
const API_SYSTEM1 = "http://localhost:8080/api/system1";
const API_SYSTEM2="http://localhost:8082/api"
export async function makeTransaction({ cardNumber, pin, amount, type }) {
  const res = await fetch(`${API_SYSTEM1}/transaction`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cardNumber,
      pin,
      amount,
      type,
    }),
  });
  
  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }
  
  const data = await res.json();
  return data; // {status,message,balance}
}

export async function getCustomerTransactions(cardNumber) {
  const res = await fetch(`${API_SYSTEM2}/logs/${cardNumber}`);
  
  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }
  
  const data = await res.json();
  return data; // array of transactions
}

export async function getAllTransactions() {
  const res = await fetch(`${API_SYSTEM2}/logs`);
  
  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }
  
  const data = await res.json();
  return data; // array of transactions
}