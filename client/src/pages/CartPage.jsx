// client/src/pages/CartPage.jsx
import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { FaTrashAlt, FaMinus, FaPlus } from "react-icons/fa";

const CartPage = () => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const [discountCode, setDiscountCode] = useState(""); // State cho mã ưu đãi

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const shippingFee = subtotal > 500000 ? 0 : 30000;
  const finalTotal = subtotal + shippingFee;

  const handleApplyDiscount = () => {
    if (discountCode.trim() === "SALE10") {
      alert(
        "Mã giảm giá đã được áp dụng! (Logic giảm giá cần được phát triển)"
      );
    } else {
      alert("Mã giảm giá không hợp lệ.");
    }
  };

  // --- CÁC STYLE MỚI CHO TRANG GIỎ HÀNG ---
  const pageContainerStyle = {
    maxWidth: "1200px",
    margin: "40px auto",
    padding: "0 20px",
    fontFamily: "Roboto, sans-serif",
    color: "#333",
  };

  const pageTitleStyle = {
    fontSize: "2.5em",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "-11px",
    textAlign: "center",
    position: "relative",
    paddingBottom: "15px",
  };

  const pageTitleUnderlineStyle = {
    width: "80px",
    height: "4px",
    background: "#28a745",
    margin: "0 auto",
    position: "absolute",
    bottom: "0",
    left: "50%",
    transform: "translateX(-50%)",
  };

  const cartContentWrapperStyle = {
    display: "flex",
    gap: "40px",
    flexWrap: "wrap-reverse",
    alignItems: "flex-start",
    marginTop: "-55px",
  };

  const cartTableColumnStyle = {
    flex: 2.5,
    minWidth: "min(100%, 650px)",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
  };

  const tableHeaderStyle = {
    display: "grid",
    gridTemplateColumns: "50px 2fr 1fr 1fr 1fr",
    gap: "10px",
    padding: "30px 30px 15px 30px",
    borderBottom: "2px solid #ddd",
    marginBottom: "15px",
    fontWeight: "bold",
    color: "#555",
    fontSize: "0.95em",
    textAlign: "center",
  };

  const tableHeaderItemStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap",
  };

  const cartItemRowStyle = {
    display: "grid",
    gridTemplateColumns: "50px 2fr 1fr 1fr 1fr",
    gap: "10px",
    padding: "15px 30px",
    borderBottom: "1px solid #eee",
    alignItems: "center",
    textAlign: "center",
    fontSize: "0.9em",
  };

  const lastCartItemRowStyle = {
    ...cartItemRowStyle,
    borderBottom: "none",
  };

  const removeItemButtonStyle = {
    background: "none",
    border: "1px solid #ddd",
    borderRadius: "50%",
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#888",
    transition: "background-color 0.2s, color 0.2s, border-color 0.2s",
    "&:hover": {
      background: "#dc3545",
      color: "white",
      borderColor: "#dc3545",
    },
  };

  const productInfoInRowStyle = {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    textAlign: "left",
  };

  const itemImageStyle = {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  };

  const itemNameInRowStyle = {
    fontWeight: "bold",
    color: "#333",
    textDecoration: "none",
    fontSize: "1em",
    "&:hover": {
      color: "#28a745",
    },
  };

  const itemPriceInRowStyle = {
    fontWeight: "normal",
    color: "#555",
  };

  const quantityControlsStyle = {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "25px",
    overflow: "hidden",
    height: "38px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    margin: "0 auto",
  };

  const qtyButtonStyle = {
    padding: "0 15px",
    height: "100%",
    border: "none",
    background: "#f8f8f8",
    cursor: "pointer",
    fontSize: "1.1em",
    color: "#555",
    transition: "background-color 0.2s, color 0.2s",
    "&:hover": {
      background: "#e0e0e0",
      color: "#28a745",
    },
  };

  const qtyDisplayBoxStyle = {
    width: "50px",
    height: "100%",
    textAlign: "center",
    lineHeight: "38px",
    borderLeft: "1px solid #ddd",
    borderRight: "1px solid #ddd",
    fontWeight: "bold",
    color: "#333",
  };

  const itemTotalInRowStyle = {
    fontWeight: "bold",
    fontSize: "1.1em",
    color: "#28a745",
  };

  const bottomActionButtonsStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "30px",
    padding: "20px 30px 0 30px",
    borderTop: "1px solid #eee",
    gap: "15px",
    flexWrap: "wrap",
  };

  const continueShoppingButtonStyle = {
    padding: "12px 25px",
    background: "white",
    color: "#2c3e50",
    border: "2px solid #2c3e50",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "1em",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "#2c3e50",
      color: "white",
    },
  };

  const updateCartButtonStyle = {
    padding: "12px 25px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "1em",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "#0056b3",
    },
  };

  const orderSummaryColumnStyle = {
    flex: 1,
    minWidth: "min(100%, 350px)",
    background: "#fcfaf5",
    borderRadius: "12px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
    height: "fit-content",
    position: "sticky",
    top: "120px",
  };

  const summaryTitleStyle = {
    fontSize: "1.8em",
    color: "#2c3e50",
    marginBottom: "25px",
    padding: "30px 30px 10px 30px",
    borderBottom: "2px solid #28a745",
    marginTop: "0",
  };

  const summaryRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
    fontSize: "1.1em",
    color: "#555",
    padding: "0 30px",
  };

  const summaryTotalRowStyle = {
    ...summaryRowStyle,
    marginTop: "25px",
    paddingTop: "20px",
    borderTop: "1px dashed #ccc",
    fontSize: "1.3em",
    fontWeight: "bold",
    color: "#28a745",
  };

  const checkoutButtonStyle = {
    width: "calc(100% - 60px)",
    padding: "18px",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1.2em",
    fontWeight: "bold",
    marginTop: "30px",
    transition: "background-color 0.3s ease, transform 0.2s",
    "&:hover": {
      backgroundColor: "#218838",
      transform: "translateY(-2px)",
    },
    marginLeft: "30px",
    marginRight: "30px",
  };

  const discountSectionStyle = {
    marginTop: "30px",
    padding: "20px 30px 30px 30px",
    borderTop: "1px solid #eee",
  };

  const discountInputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "1em",
    marginBottom: "15px",
    boxSizing: "border-box",
  };

  const applyDiscountButtonStyle = {
    width: "100%",
    padding: "12px",
    background: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1em",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#5a6268",
    },
  };

  const emptyCartContainerStyle = {
    textAlign: "center",
    padding: "80px 20px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
    margin: "50px auto",
    maxWidth: "800px",
  };

  const emptyCartMessageStyle = {
    fontSize: "1.5em",
    color: "#555",
    marginBottom: "30px",
  };

  const shopNowButtonStyle = {
    padding: "15px 30px",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "1.1em",
    fontWeight: "bold",
    transition: "background-color 0.3s ease, transform 0.2s",
    "&:hover": {
      backgroundColor: "#218838",
      transform: "translateY(-2px)",
    },
  };

  const applyHover = (e, hoverStyle) =>
    Object.assign(e.currentTarget.style, hoverStyle);
  const removeHover = (e, baseStyle) =>
    Object.assign(e.currentTarget.style, baseStyle);

  return (
    <div style={pageContainerStyle}>
      <h1 style={pageTitleStyle}>
        Giỏ hàng của bạn
        <div style={pageTitleUnderlineStyle}></div>
      </h1>
      {cartItems.length === 0 ? (
        <div style={emptyCartContainerStyle}>
          <p style={emptyCartMessageStyle}>Giỏ hàng của bạn đang trống.</p>
          <Link
            to="/shop"
            style={shopNowButtonStyle}
            onMouseOver={(e) => applyHover(e, shopNowButtonStyle["&:hover"])}
            onMouseOut={(e) => removeHover(e, shopNowButtonStyle)}
          >
            Bắt đầu mua sắm ngay!
          </Link>
        </div>
      ) : (
        <div style={cartContentWrapperStyle}>
          <div style={cartTableColumnStyle}>
            {/* Headers của bảng */}
            <div style={tableHeaderStyle}>
              <div style={tableHeaderItemStyle}></div>
              <div
                style={{
                  ...tableHeaderItemStyle,
                  justifyContent: "flex-start",
                }}
              >
                SẢN PHẨM
              </div>
              <div style={tableHeaderItemStyle}>GIÁ</div>
              <div style={tableHeaderItemStyle}>SỐ LƯỢNG</div>
              <div style={tableHeaderItemStyle}>TỔNG CỘNG</div>
            </div>

            {/* Danh sách các sản phẩm */}
            {cartItems.map((item, index) => (
              <div
                key={item._id || item.id}
                style={
                  index === cartItems.length - 1
                    ? lastCartItemRowStyle
                    : cartItemRowStyle
                }
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <button
                    onClick={() => removeFromCart(item)}
                    style={removeItemButtonStyle}
                    onMouseOver={(e) =>
                      applyHover(e, removeItemButtonStyle["&:hover"])
                    }
                    onMouseOut={(e) => removeHover(e, removeItemButtonStyle)}
                  >
                    <FaTrashAlt size={12} />
                  </button>
                </div>

                <div style={productInfoInRowStyle}>
                  <img
                    src={
                      item.images && item.images.length > 0
                        ? item.images[0]
                        : "https://via.placeholder.com/80?text=No+Image"
                    }
                    alt={item.name}
                    style={itemImageStyle}
                  />
                  <Link
                    to={`/products/${item._id || item.id}`}
                    style={itemNameInRowStyle}
                    onMouseOver={(e) =>
                      applyHover(e, itemNameInRowStyle["&:hover"])
                    }
                    onMouseOut={(e) => removeHover(e, itemNameInRowStyle)}
                  >
                    {item.name}
                  </Link>
                </div>

                <div style={itemPriceInRowStyle}>
                  {item.price ? item.price.toLocaleString("vi-VN") : "N/A"} VNĐ
                </div>

                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={quantityControlsStyle}>
                    <button
                      onClick={() => addToCart(item, -1)}
                      style={qtyButtonStyle}
                      onMouseOver={(e) =>
                        applyHover(e, qtyButtonStyle["&:hover"])
                      }
                      onMouseOut={(e) => removeHover(e, qtyButtonStyle)}
                    >
                      <FaMinus size={14} />
                    </button>
                    <span style={qtyDisplayBoxStyle}>{item.qty}</span>
                    <button
                      onClick={() => addToCart(item, 1)}
                      style={qtyButtonStyle}
                      onMouseOver={(e) =>
                        applyHover(e, qtyButtonStyle["&:hover"])
                      }
                      onMouseOut={(e) => removeHover(e, qtyButtonStyle)}
                    >
                      <FaPlus size={14} />
                    </button>
                  </div>
                </div>

                <div style={itemTotalInRowStyle}>
                  {(item.qty * item.price || 0).toLocaleString("vi-VN")} VNĐ
                </div>
              </div>
            ))}

            {/* Các nút hành động dưới bảng */}
            <div style={bottomActionButtonsStyle}>
              <Link
                to="/shop"
                style={continueShoppingButtonStyle}
                onMouseOver={(e) =>
                  applyHover(e, continueShoppingButtonStyle["&:hover"])
                }
                onMouseOut={(e) => removeHover(e, continueShoppingButtonStyle)}
              >
                ← TIẾP TỤC XEM SẢN PHẨM
              </Link>
            </div>
          </div>

          <div style={orderSummaryColumnStyle}>
            <h2 style={summaryTitleStyle}>Tóm tắt đơn hàng</h2>
            <div style={summaryRowStyle}>
              <span>Tạm tính ({totalItems} sản phẩm)</span>
              <span style={{ fontWeight: "bold" }}>
                {subtotal.toLocaleString("vi-VN")} VNĐ
              </span>
            </div>
            <div style={summaryRowStyle}>
              <span>Phí vận chuyển</span>
              <span
                style={{
                  fontWeight: "bold",
                  color: shippingFee === 0 ? "#28a745" : "#555",
                }}
              >
                {shippingFee === 0
                  ? "Miễn phí"
                  : shippingFee.toLocaleString("vi-VN") + " VNĐ"}
              </span>
            </div>
            <div style={summaryTotalRowStyle}>
              <span>Tổng cộng:</span>
              <span>{finalTotal.toLocaleString("vi-VN")} VNĐ</span>
            </div>

            <Link
              to="/checkout"
              style={checkoutButtonStyle}
              onMouseOver={(e) => applyHover(e, checkoutButtonStyle["&:hover"])}
              onMouseOut={(e) => removeHover(e, checkoutButtonStyle)}
            >
              TIẾN HÀNH THANH TOÁN
            </Link>

            {/* Phần mã ưu đãi */}
            <div style={discountSectionStyle}>
              <h3
                style={{
                  fontSize: "1.2em",
                  marginBottom: "15px",
                  color: "#555",
                  marginTop: "0",
                }}
              >
                Mã ưu đãi
              </h3>
              <input
                type="text"
                placeholder="Nhập mã ưu đãi của bạn"
                style={discountInputStyle}
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <button
                onClick={handleApplyDiscount}
                style={applyDiscountButtonStyle}
                onMouseOver={(e) =>
                  applyHover(e, applyDiscountButtonStyle["&:hover"])
                }
                onMouseOut={(e) => removeHover(e, applyDiscountButtonStyle)}
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
