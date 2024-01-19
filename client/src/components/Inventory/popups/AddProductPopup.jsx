import React, { useState, useContext } from "react";
import "./popup.css";
import "./AddProductRow.css";
import { createInventoryItem } from "../../../api/inventoryAPI";
import { InventoryContext } from "../../../contexts/inventory.context";
import Swal from "sweetalert2";
import { useQuery } from "react-query";
import { authenticateUser } from "../../../api/authenticationAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const AddProductPopup = ({ onClose }) => {
  const { reloadInventory } = useContext(InventoryContext);

  const [addProdInfo, setAddProdInfo] = useState({
    sku: "",
    brand: "",
    productName: "",
    description: "",
    inStock: "",
    reorderAt: "",
    orderQty: "",
    unitPrice: "",
  });

  // ---------------- add product functions start ---------------------
  const handleAddProd_InputChange = (e) => {
    // (e) represents the event - the exact input that changed
    const { name, value } = e.target;
    setAddProdInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  async function handleCreateItem(e) {
    e.preventDefault();
    const response = await createInventoryItem(addProdInfo);
    if (!response.id) {
      onClose();
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${response}`,
        background: "#333",
        color: "#fff",
        confirmButtonColor: "#3b9893",
      });
    }
    // clear fields after response succeeds
    clearProdInputFields();
    reloadInventory();
    onClose();
    return Swal.fire({
      icon: "success",
      title: "Success!",
      text: `${response.productName} added to database`,
      background: "#333",
      color: "#fff",
      confirmButtonColor: "#3b9893",
    });
  }

  function clearProdInputFields() {
    setAddProdInfo((prevState) => {
      return Object.fromEntries(Object.keys(prevState).map((key) => [key, ""]));
    });
  }

  return (
    <div className="popup-container">
      <div className="popup-content">
        <form onSubmit={handleCreateItem}>
          <div className="popup-title">
            <h2>Add Product</h2>
          </div>
          <div className="product">
            <label>
              SKU
              <input
                type="text"
                name="sku"
                value={addProdInfo.sku}
                onChange={handleAddProd_InputChange}
              />
            </label>
            <label>
              Brand
              <input
                type="text"
                name="brand"
                value={addProdInfo.brand}
                onChange={handleAddProd_InputChange}
              />
            </label>
            <label>
              Name
              <input
                type="text"
                name="productName"
                value={addProdInfo.productName}
                onChange={handleAddProd_InputChange}
              />
            </label>
            <label>
              Description
              <input
                type="text"
                name="description"
                value={addProdInfo.description}
                onChange={handleAddProd_InputChange}
              />
            </label>
            <label>
              Stock
              <input
                type="text"
                name="inStock"
                placeholder="0"
                value={addProdInfo.inStock}
                onChange={handleAddProd_InputChange}
              />
            </label>
            <label>
              Reorder at
              <input
                type="text"
                name="reorderAt"
                placeholder="0"
                value={addProdInfo.reorderAt}
                onChange={handleAddProd_InputChange}
              />
            </label>
            <label>
              Order QTY
              <input
                type="text"
                name="orderQty"
                placeholder="0"
                value={addProdInfo.orderQty}
                onChange={handleAddProd_InputChange}
              />
            </label>
            <label>
              Cost
              <input
                type="text"
                name="unitPrice"
                placeholder="$ 0.00"
                value={addProdInfo.unitPrice}
                onChange={handleAddProd_InputChange}
              />
            </label>
          </div>
          <div className="btn-container">
            <button
              className="save-btn"
              type="submit"
              onSubmit={handleCreateItem}
            >
              Save
            </button>
            <button className="close-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPopup;
