import React, {useState, useEffect} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    getCartItems,
    removeCartItems,
    setCartItems,
} from "../../../utils/storeSession";
import {fCurrency} from "../../utils/FormatCost";
import {getToTalCart} from "../../../redux/actions/productAction";
import {connect} from "react-redux";

const RelatedProduct = ({regionId, id, getToTalCart}) => {
    const [product, setProduct] = useState(null);
    const getProduct = async () => {
        await axios
            .get(process.env.REACT_APP_HOST + `/api/Products`)
            .then((res) => {
                setProduct(res.data.$values);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        getProduct();
    }, []);
    const handleAddToCart = (item) => {
        let price = 0;
        if (item.product.priceSale > 0) {
            price = item.product.priceSale;
        } else {
            price = item.product.price;
        }
        const cartItems = getCartItems();
        let indexItemInCart = cartItems.findIndex((item) => item.id === id);

        if (indexItemInCart > -1) {
            cartItems.splice(indexItemInCart, 1, {
                id: item.product.id,
                amount: cartItems[indexItemInCart].amount + 1,
                name: item.product.name,
                image: item.image,
                price: price,
            });
            toast.success("Cập nhật giỏ hàng");
            getToTalCart(getCartItems())
        } else {
            cartItems.push({
                id: item.product.id,
                amount: 1,
                name: item.product.name,
                image: item.image,
                price: price,
            });
            toast.success("Thêm giỏ hàng thành công");
            getToTalCart(getCartItems())
        }

        removeCartItems();
        setCartItems(cartItems);
    };
    return (
        <>
            <ToastContainer
                position="bottom-left"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            {/* Same as */}

            <div className="related-products-area pb-70">
                <div className="container">
                    <div className="section-title text-center">
                        <h2>Các sản phẩm cùng vùng miền</h2>
                    </div>
                    <div className="row pt-45">
                        {product &&
                        product.length > 0 &&
                        product.filter(item => item.product.regionId === regionId).map((item, index) => {
                            return index < 12 && (
                                <>
                                    <div className="col-lg-3 col-sm-6">
                                        <div className="product-item">
                                            <div className="product-img">
                                                <Link to={`/detail-products/${item.product.id}`}>
                                                    <img
                                                        src={process.env.REACT_APP_HOST + `/uploads/${item.image}`}
                                                        alt="Product Images"
                                                    />
                                                </Link>
                                                <div className="product-item-tag">
                                                    <h3>Mới</h3>
                                                </div>
                                                <ul className="product-item-action">
                                                    <li>
                                                        <a
                                                            onClick={() => handleAddToCart(item)}
                                                            href="#"
                                                        >
                                                            <i className="bx bx-cart"/>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="content">
                                                <h3>
                                                    <Link to={`/detail-products/${item.product.id}`}>
                                                        <a href="">
                                                            {item.product.name}
                                                        </a>
                                                    </Link>
                                                </h3>
                                                <span>{item.product.priceSale > 0 ? <>{fCurrency(item.product.priceSale)}
                                                    <del>{fCurrency(item.product.price)}</del>
                                                </> : <>{fCurrency(item.product.price)}</>}</span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {

    getToTalCart
};

export default connect(mapStateToProps, mapDispatchToProps)(RelatedProduct);
