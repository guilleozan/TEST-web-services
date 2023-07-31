import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './../styles/ProductPage.css';



const Product = () => {
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        'https://3sb655pz3a.execute-api.ap-southeast-2.amazonaws.com/live/product'
      );
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      setProduct(null);
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError('Please select a size before adding to cart.');
      return;
    }

    setError('');
    const existingProduct = cart.find((item) => item.size === selectedSize);
    if (existingProduct) {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.size === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart((prevCart) => [
        ...prevCart,
        { ...product, size: selectedSize, quantity: 1 },
      ]);
    }
  };

  const handleRemoveFromCart = (item) => {
    setCart((prevCart) => prevCart.filter((cartItem) => cartItem !== item));
  };

  const handleMiniCartClose = () => {
    setIsMiniCartOpen(false);
  };

  return (
    <div className="container">
      {product ? (
        <>
          <div className="card product-card">
            <img
              src={product.imageURL}
              alt={product.title}
              className="card-img-top product-image"
            />
            <div className="card-body">
              <h2 className="card-title">{product.title}</h2>
              <p className="card-text">{product.description}</p>
              <p className="card-price">${product.price.toFixed(2)}</p>
              <p>Size *</p>
              <div className="size-options">
               <br/>
                {product.sizeOptions.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => handleSizeSelect(size.label)}
                    className={`btn ${
                      selectedSize === size.label
                        ? 'btn-danger'
                        : 'btn-outline-secondary'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
              {error && <p className="error-message">{error}</p>}
              <button
                onClick={() => {
                  handleAddToCart();
                  setIsMiniCartOpen(true);
                }}
                className="btn btn-primary btn-lg btn-block"
              >
                Add to Cart 
              </button>
            </div>
          </div>
        </>
      ) : (
        <p>Loading product details...</p>
      )}

    {/* Mini Cart */}
    {isMiniCartOpen && cart.length > 0 && (
        <div className="mini-cart">
          <button
            className="close-button"
            onClick={handleMiniCartClose}
          >
            <i className="bi bi-x-circle-fill"></i>
          </button>
          <h6 className>
            <i className="bi bi-cart4"></i>
            ({cart.length})
          </h6>
          {cart.map((item, index) => (
            <div key={index} className="mini-cart-item">
              <img
                src={item.imageURL}
                alt={item.title}
              />
              <div>
                <p>{item.title}</p>
                <p>Size: {item.size}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.price.toFixed(2)}</p>
              </div>
              <button onClick={() => handleRemoveFromCart(item)}>
                <i className="bi bi-trash3"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Product;
