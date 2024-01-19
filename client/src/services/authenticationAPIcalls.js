const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export async function authenticateUser() {
  const response = await fetch(`${API_URL}/authentication/authenticateUser`, {
    method: 'GET',
    withCredentials: true,
    credentials: 'include',
  });
  const user = await response.json();
  if (user === 'TokenExpiredError') {
    return getToken();
  } else {
    return user;
  }
}

export async function getToken() {
  await fetch(`${API_URL}/authentication/token`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  }).then((res) => {
    return res.data;
  });
}

// totalIncomingQty, incomingDates,
export async function createUser(username, password) {
  const response = await fetch(`${API_URL}/user/`, {
    method: "POST",
    body: JSON.stringify({
      username: username,
      password: password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
}
export async function loginUser(username, password) {
  const response = await fetch(`${API_URL}/user/login`, {
    method: 'POST',
    body: JSON.stringify({
      username: username,
      password: password,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}

export async function updateUser(id, updates) {
  const {
    sku,
    schedArrivalDate,
    delivered,
    orderQty,
    shipperName,
    shipperAddress,
    shipperPhone,
    totalCost,
    shippingCost,
  } = updates;
  const response = await fetch(`${API_URL}/user/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      sku,
      schedArrivalDate,
      delivered,
      orderQty,
      shipperName,
      shipperAddress,
      shipperPhone,
      totalCost,
      shippingCost,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}
