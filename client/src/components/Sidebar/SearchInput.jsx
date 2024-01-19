import React, { useState, useContext, useEffect, useRef } from 'react';
import { InventoryContext } from '../../contexts/inventory.context';
import './SearchInput.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

function SearchInput() {
  const { inventory } = useContext(InventoryContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSku, setSelectedSku] = useState('');
  const productRowRef = useRef(null);

  /*   useEffect(() => {
      console.log(inventory)
    }, [inventory]) */

  //   handleInputChange will be called when user types in the seach input. trims whitespace and converts to lowercase. 
  const handleInputChange = (event) => {
    const value = event.target.value.trim().toLowerCase();
    /*     console.log('value' + value)
        console.log('inventory' + typeof inventory) */
    setSearchTerm(value);
    // filter inventory array based on all property values, conditional used to check if the value is a string before calling
    const filteredResults = value ? inventory.filter(
      (product) => {
        const values = Object.values(product).map(val => // returns an array of the values of all properties in the product object.
          typeof val === 'string' ? val.toLowerCase() : val); // map is called on this array, applying the following function to each value: If the value is a string, convert it to lowercase. Otherwise, leave it as is.
        return values.some(val => typeof val === 'string' && val.includes(value)); // some is called on the result value, it returns true if the element is a string or if the string contains the value to be searched for
      }
    ) : [];
    // console.log('filter' + filteredResults)
    setSearchResults(filteredResults);
  };
  // called when user clicks clear button to clear results 
  const handleClearClick = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleItemClick = (sku) => {
    setSelectedSku(sku);
  };


  // when the user clicks on a search result, the handleItemClick function is called with the SKU of the selected item. 
  // This updates the state with the selected SKU, which triggers useEffect hook. The hook uses the selected SKU to find the corresponding 
  // element on the page using getElementById. It then scrolls to the element using scrollIntoView and applies the highlight class to the element using classList.add. 
  // then removes the highlight class after 2 seconds using setTimeout and classList.remove.

  useEffect(() => {
    /*  console.log(productRowRef.current)
     console.log()
     console.log('useEffect triggered'); */
    if (productRowRef.current) {
      // console.log('scrolling to:', selectedSku);
      // Find the closest parent element that has a "data-sku" attribute
      const productRow = productRowRef.current.closest('[data-sku]');
      // console.log('product row:' + productRow)
      if (productRow) {
        productRow.classList.add('highlight');
        productRow.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
          productRow.classList.remove('highlight');
        }, 2000);
      }
    }
  }, [selectedSku]);


  return (
    <>
      <form className='form'>
        <input
          id='search'
          type='text'
          className='search-input'
          placeholder='Search'
          value={searchTerm}
          onChange={handleInputChange}
        />
        <div className='searchIcon'>
          {searchResults.length === 0 ? ( // search icon appears until an inputted value is filtered, then clear icon replaces search icon
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
            />
          ) : (
            <FontAwesomeIcon
              icon={faCircleXmark}
              id="clear"
              onClick={handleClearClick}
            />
          )}
        </div>
      </form>

      <div className='results-container'>
        <div className='results-list' id='list'>
          {/* iterate over searchResults - renders matching items. displays under the search bar with LIs in a dropdown */}
          {searchResults.map((product, index) => (
            <ul key={index}>
              {Object.keys(product).map(key => {
                if (typeof product[key] === 'string' && product[key].toLowerCase().includes(searchTerm)) {
                  return <li key={key}>
                    <a href={`#${product.sku}`} onClick={() => handleItemClick(product.sku)}>{product[key]}</a>
                  </li>
                }
              })}
            </ul>
          ))}
        </div>
      </div>
    </>
  );
}

export default SearchInput;



