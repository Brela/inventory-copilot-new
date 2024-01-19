import getRandomShipper from '../utils/getRandomShipper';
import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export async function sendCSVfile(csvFile) {
  console.log(csvFile);
  const formData = new FormData();
  formData.append("csvFile", csvFile);
  fetch(`${API_URL}/inventory/upload`, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then(async (data) => {
      // Add shipper field to each object in the data array
      const processedData = data.map((item) => ({
        ...item,
        shipper: getRandomShipper(),
      }));
      const csvFile = await createManyInventoryItems(processedData);
      return csvFile;
    })
    .catch((error) => console.error(error));
}

export async function getInventoryList(filterBy, sortOrder) {
  const response = await fetch(
    `${API_URL}/inventory/${filterBy}/${sortOrder}`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  return response.json();
}

export async function getInventoryItem(id) {
  const response = await fetch(`${API_URL}/inventory/${id}`, {
    method: "GET",
    credentials: "include",
  });
  return response.json();
}

// totalIncomingQty, incomingDates,
export async function createInventoryItem(product) {
  const response = await fetch(`${API_URL}/inventory/`, {
    method: "POST",
    body: JSON.stringify({
      sku: product.sku,
      brand: product.brand,
      productName: product.productName,
      description: product.description,
      shipper: getRandomShipper(),
      inStock: Number(product.inStock),
      reorderAt: Number(product.reorderAt),
      orderQty: Number(product.orderQty),
      unitPrice: Number(product.unitPrice),
    }),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (response.status === 400) {
    const message = await response.json();
    return message.error;
  }
  return response.json();
}

export async function createManyInventoryItems(products) {
  let message;
  await products.map((product) => {
    for (let prop in product) {
      if (product.hasOwnProperty(prop)) {
        if (
          prop === "inStock" ||
          prop === "reorderAt" ||
          prop === "orderQty" ||
          prop === "unitPrice"
        ) {
          product[prop] = parseInt(product[prop]);
        }
      }
    }
  });
  console.log(products);
  const response = await fetch(`${API_URL}/inventory/bulk`, {
    method: "POST",
    body: JSON.stringify({ products }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  message = await response.json();
  if (response.status === 400) {
    return Swal.fire({
      icon: "error",
      title: "Oops...",
      text: `${message.error}`,
      background: "#19191a",
      color: "#fff",
      confirmButtonColor: "#2952e3",
    });
  }
  return Swal.fire({
    icon: "success",
    title: "Success!",
    text: `${message} products have been added to inventory`,
    background: "#19191a",
    color: "#fff",
    confirmButtonColor: "#2952e3",
  }).then((result) => {
    if (result.isConfirmed) {
      location.reload();
    }
  });
}

export async function updateInventoryItem(id, updates) {
  const { sku, brand, productName, description, inStock, reorderAt, orderQty } =
    updates;
  const response = await fetch(`${API_URL}/inventory/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      sku,
      brand,
      productName,
      description,
      inStock,
      reorderAt,
      orderQty,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}

export async function deleteInventoryItems(ids) {
  const response = await fetch(`${API_URL}/inventory/bulk`, {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}
