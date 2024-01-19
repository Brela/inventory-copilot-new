import { useState, useEffect } from 'react';

export const useTempInStock = (inventory, isUsingStock, setIsUsingStock, tempInStock, setTempInStock, useSelectedOnlyOn, selectedItems, hasFetchedUserSettings) => {

    selectedItems = Array.from(selectedItems)
    // -------------- use tempInStock state that is declared in the inventory.context to setTempInStock-------------

    useEffect(() => {
      if (!Array.isArray(inventory)) {
        console.warn("inventory is not an array:", inventory);
        return;
      }
      const inStockData = {};
      inventory?.forEach((item) => {
        inStockData[item.id] = item.inStock;
      });
      setTempInStock(inStockData);

      // console.log(tempInStock)
    }, [inventory]);

    // ----------- Update tempInStock every second based on its previous value ---------
    useEffect(() => {
      let intervalId = null;
      if (isUsingStock === true && hasFetchedUserSettings) {
        /*          console.log(hasFetchedUserSettings)
                     console.log(Array.from(selectedItems)) */
        if (Array.from(selectedItems).length > 0) {
          decreaseStock();
        } else {
          console.log(hasFetchedUserSettings);
          setIsUsingStock(false);
          window.alert("Must select some products before hitting play.");
          return;
        }
        function decreaseStock() {
          // console.log(selectedItems, '----')
          intervalId = setInterval(() => {
            setTempInStock((prevInStock) => {
              const updatedInStock = {};
              inventory?.forEach((item) => {
                // update tempInStock for only selected products if useSelectedOnlyOn is on
                // if (useSelectedOnlyOn && !selectedItems.includes(item.id)) {
                if (!selectedItems.includes(item.id)) {
                  updatedInStock[item.id] = prevInStock[item.id];
                } else {
                  // decrease selected items
                  // console.log(item.id)
                  // console.log(selectedItems)
                  updatedInStock[item.id] =
                    prevInStock[item.id] > 0 ? prevInStock[item.id] - 1 : 0;
                }
              });
              return updatedInStock;
            });
          }, 2000);
        }
      }
      return () => clearInterval(intervalId);
    }, [inventory, isUsingStock, useSelectedOnlyOn, hasFetchedUserSettings]);

    return [setTempInStock];
}
