import React, { useEffect, useState, useContext } from 'react';
import { InventoryContext } from '../../contexts/inventory.context';
import { OrdersContext } from '../../contexts/orders.context'
import { getSettings } from '../../services/settingsAPIcalls'
import { updateSetting } from '../../services/settingsAPIcalls'

function FilterBy() {
  const [settings, setSettings] = useState();
  const { userSettings, reloadInventory, userData } = useContext(InventoryContext);
  const { reloadOrders } = useContext(OrdersContext);
  const [selectedOption, setSelectedOption] = useState('');


  const handleFilterChange = async (event) => {
    const twoValues = event.target.value;
    setSelectedOption(twoValues);
    let newFilterBy, newSortOrder;
    newFilterBy = twoValues.split('_')[0];
    newSortOrder = twoValues.split('_')[1];
    const filterBy = newFilterBy;
    const sortOrder = newSortOrder;

    if (userData) {
      let updated = await updateSetting(userData.username, { filterBy, sortOrder });
      // trigger rerender of handleGetSettings because settings state is a dependancy
      setSettings(updated);

      const updatedUserData = [filterBy, sortOrder];
      reloadInventory(null, updatedUserData);
      reloadOrders();
    }

  };
  useEffect(() => {
    reloadInventory()
  }, [userSettings])

  useEffect(() => {
    const handleGetSettings = async () => {
      if (userData) {
        const settingsData = await getSettings(userData.username);
        setSettings(settingsData);
        if (settingsData.filterBy && settingsData.sortOrder) {
          setSelectedOption(`${settingsData.filterBy}_${settingsData.sortOrder}`);
        }
      }
    };
    handleGetSettings();
  }, [userData]);


  return (
    <select id='filterBy'
      onChange={handleFilterChange}
      defaultValue={selectedOption}
      key={selectedOption}
    >
      <option value="sku_asc">Sku (A-Z)</option>
      <option value="sku_desc">Sku (Z-A)</option>
      <option value="brand_asc">Brand (A-Z)</option>
      <option value="brand_desc">Brand (Z-A)</option>
      <option value="inStock_asc">Stock (Low to High)</option>
      <option value="inStock_desc">Stock (High to Low)</option>
    </select>
  );
}

export default FilterBy;
