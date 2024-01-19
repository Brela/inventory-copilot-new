const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export async function getUsers() {
  const response = await fetch(`${API_URL}/user/`, {
    method: 'GET',
    credentials: 'include',
  });
  return response.json();
}

export async function getUser(id) {
  const response = await fetch(`${API_URL}/user/${id}`, {
    method: 'GET',
    credentials: 'include',
  });
  return response.json();
}



// totalIncomingQty, incomingDates,
export async function createUser(username, password) {
  try {
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

    if (!response.ok) {
      const errorData = await response.json();
      window.alert(
        `Failed to sign up: ${errorData.message || "Unknown error"}`
      );
      return null;
    }

    window.alert(`${username} successfully signed up`);
    return response.json();
  } catch (error) {
    console.error("An error occurred during the sign-up process:", error);
    window.alert(`Failed to sign up: ${error.message}`);
    return null;
  }
}
  

export async function loginUser(username, password) {
  const response = await fetch(`${API_URL}/authentication/login`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({
      username: username,
      password: password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        console.log("Response status:", res.status); // Log the status code
        console.log("Response text:", res.statusText); // Log the status text
        throw new Error("Failed to fetch");
      }
      return res.json();
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });

  return response;
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
    method: "PATCH",
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
      "Content-Type": "application/json",
    },
  });
  return response.json();
}

export async function deleteUser(id) {
  const response = await fetch(`${API_URL}/user/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
}

export async function logoutUser() {
  const response = await fetch(`${API_URL}/authentication/logout`, {
    method: "POST",
    withCredentials: true,
    credentials: "include",
  });
  return response.json();
}
