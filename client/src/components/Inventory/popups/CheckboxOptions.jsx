import React, { useState, useEffect, useContext } from "react";
import { InventoryContext } from "../../../contexts/inventory.context";
import { OrdersContext } from "../../../contexts/orders.context";

import { deleteInventoryItems } from "../../../api/inventoryAPI";
import { Switch } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";

export default function SelectedCheckboxOptions({
  handleClosePopup,
  popup,
  highlightSelectedProducts,
  setHighlightSelectedProducts,
}) {
  const {
    inventory,
    reloadInventory,
    isUsingStock,
    selectedItems,
    setSelectedItems,
    toggleSelectedItem,
  } = useContext(InventoryContext);
  const { orders, reloadOrders } = useContext(OrdersContext);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);

  // -------- select and deselect all boxes via "select aLL" switch ----------
  const handleSelectAllToggle = (event) => {
    setSelectAllChecked(event.target.checked);
    if (event.target.checked) {
      // add every item to Set that will its checkbox checked
      setSelectedItems(new Set(inventory.map((item) => item.id)));
    } else {
      // clear list to deselect all checkboxes
      setSelectedItems(new Set());
    }
  };
  const handleHighlightSelectedToggle = (event) => {
    setHighlightSelectedProducts(event.target.checked);
  };

  const handleDisplayConfirmationToggle = (event) => {
    setDisplayConfirmation(event.target.checked);
  };

  /*     useEffect(() => {
            console.log(inventory)
            console.log(selectedItems)
        }, [inventory, selectedItems]) */

  function findProductById(id) {
    return inventory.find((product) => product.id === id);
  }

  const [message, setMessage] = useState(null);
  async function handleDeleteProducts(event) {
    const result = window.confirm(
      "Are you sure you want to delete the selected items?",
    );
    if (result) {
      try {
        await deleteInventoryItems(selectedItems);
        // Remove deleted items' IDs from selectedItems array
        setSelectedItems([]);

        setMessage("Products deleted successfully.");
        setTimeout(() => {
          setMessage(null);
        }, 3000); // 3 seconds timeou
        reloadInventory();
        reloadOrders();
      } catch (error) {
        setMessage("An error occurred while deleting products.");
        console.error("Error deleting products:", error);
      } finally {
        handleClosePopup(event);
      }
    }
  }
  // for error handling - in case the selected items aren't removed when a product is deleted, we can keep track of the number that are skipped
  let countOfSkippedProducts = 0;

  return (
    <>
      <div className="popup checkbox-options-popup">
        <h2>Checkbox Selection Options</h2>
        <section className="options-section">
          <div className="rows">
            <div className="">Select All</div>
            <Switch
              checked={selectAllChecked}
              onChange={handleSelectAllToggle}
            />
          </div>
          <div className="rows">
            <div className="">Highlight Selected</div>
            <Switch
              checked={highlightSelectedProducts}
              onChange={handleHighlightSelectedToggle}
            />
          </div>
          <div className="rows ">
            <div className="">
              Display list to delete all or create orders for selected
            </div>
            <Switch
              className="display-list"
              checked={displayConfirmation}
              onChange={handleDisplayConfirmationToggle}
            />
          </div>
        </section>
        {/* this section is displayed when the toggle switch for "display list..." is on */}
        {displayConfirmation && (
          <section className="confirmation">
            <div className="listOfSelectedContainer">
              <ul>
                {
                  // this displays the list of selected items that comes from inventory.context
                  selectedItems.map((id, index) => {
                    const product = findProductById(id);
                    if (!product) {
                      countOfSkippedProducts += 1;
                      return null; // Skip this item
                    }
                    console.log(product);
                    const adjustedIndex = index - countOfSkippedProducts;
                    return (
                      <li key={id}>
                        <div className="list-numbering">
                          {adjustedIndex + 1}
                        </div>
                        <div>{product.sku}</div>
                        <div className="list-spacer">-</div>
                        <div>{product.productName}</div>
                      </li>
                    );
                  })
                }
              </ul>
            </div>
            <div className="rows">
              <p>
                Delete {selectedItems.length - countOfSkippedProducts} selected
                products and any orders associated with them
              </p>
              <button onClick={handleDeleteProducts}>
                <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
              </button>
            </div>
            {/*  <div className='rows'>
                            <p>Create a one time order for each of the {selectedItems.length - countOfSkippedProducts} selected products</p>
                            <button

                            >
                                <FontAwesomeIcon
                                    icon={faShoppingBag}>
                                </FontAwesomeIcon>
                            </button>
                        </div> */}
          </section>
        )}
        <section>
          <button
            id="close"
            onClick={(event) => handleClosePopup(event)}
            className={popup === "close" ? "hide" : "show"}
          >
            Close
          </button>
        </section>
      </div>
      {message && (
        <div className="popup-message popup">
          <p>{message}</p>
        </div>
      )}
    </>
  );
}
