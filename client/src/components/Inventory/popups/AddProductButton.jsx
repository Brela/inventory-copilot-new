import React, { useEffect, useState, useContext } from "react";
import { useDropdown } from "../../../hooks/useDropDown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InventoryContext } from "../../../contexts/inventory.context";
import {
  faSquarePlus,
  faFileCsv,
  faPlusSquare,
} from "@fortawesome/free-solid-svg-icons";
import { sendCSVfile } from "../../../api/inventoryAPI";
import AddProductPopup from "./AddProductPopup.jsx";
import "./AddProductButton.css";
import Swal from "sweetalert2";

export default function AddProductButton({ data }) {
  const { reloadInventory, userData } = useContext(InventoryContext);
  // console.log(document.getElementById('csv-file'));

  /* 
    useEffect(() => {
      console.log(userData)
    }) */
  // -------------------------- CSV ----------------------------
  const openCSVPopup = async () => {
    await Swal.fire({
      icon: "info",
      title: "How to upload product csv file",
      html: '<div class="csv-container"><ul><li>Download or make a copy of the following Google spreadsheet: <a class="google-hyperlink" href=https://docs.google.com/spreadsheets/d/11zLdc7QNXyBjnA-qKAbet-_KD8ODlS14SRF0b8n4HEw/edit?usp=sharing target="_blank">Orderly Product Inventory List</a></li><li>Add your products to spreadsheet. You can use the following example for reference: <a class="google-hyperlink" href=https://docs.google.com/spreadsheets/d/1JuiVfSlx31bWeiF6UiBeKYsL56ll1NAX7EDUStwrAww/edit?usp=sharing target="_blank">Orderly Product Inventory List - Example<a/></li><li>Download your spreadsheet as a Comma Separated Values (.csv)</li><li>Select OK to upload your .csv file</li></ul><div>',
      text: ` products have been added to inventory`,
      background: "#19191a",
      color: "#fff",
      confirmButtonColor: "#2952e3",
      showCancelButton: true,
      customClass: {
        confirmButton: "csv-upload-button",
        popup: "csv-instructions",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (document?.getElementById("csv-file")) {
          const csvButton = await document?.getElementById("csv-file").click();
        }
      }
    });
  };

  const handleChange = async (e) => {
    console.log(e.target.files[0]);
    if (!e.target.files[0]) {
      return;
    }
    await sendCSVfile(e.target.files[0]);
    reloadInventory();
  };
  // -------------------------- Popup ----------------------------
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
    handleDropClose();
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  //   defines the custom hook from useDrownDown in hooks folder
  const {
    isDropOpen,
    setIsDropOpen,
    dropdownRef,
    toggleDropdown,
    handleDropClose,
  } = useDropdown();

  return (
    <div className="dropdown-icon">
      <button className="addprodicon">
        <FontAwesomeIcon icon={faSquarePlus} onClick={toggleDropdown} />
      </button>
      {isDropOpen && (
        <div ref={dropdownRef} className="dropdown-menu">
          <ul className="dropdown-items">
            <li>
              <button
                onClick={() => {
                  openPopup();
                  // document
                  //   .getElementById('scrollForAddRow')
                  //   .scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {/* <FontAwesomeIcon icon={faSquarePlus} className="fa-dropdown" /> */}
                Add Product
              </button>
            </li>
            <li>
              <button onClick={() => openCSVPopup()}>
                {/* <FontAwesomeIcon
                    icon={faFileCsv}
                    className="fa-dropdown"
                  /> */}
                From File
              </button>
            </li>
          </ul>
        </div>
      )}
      {isPopupOpen && <AddProductPopup onClose={closePopup} />}
      <input
        type="file"
        accept=".csv"
        onChange={(e) => handleChange(e)}
        style={{ display: "none" }}
        // hidden
        id="csv-file"
      />
    </div>
  );
}
