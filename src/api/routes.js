const apiRoutes = {
  login() {
    return "/auth/login";
  },
  register() {
    return "/auth/register";
  },
  fetchProducts(searchTerm, offset) {
    return `/product?search=${searchTerm ? searchTerm : ""}&offset=${offset}`;
  },
  addProduct() {
    return "/product/";
  },
  editProduct(id) {
    return `/product/${id}`;
  },
  deleteProduct(id) {
    return `/product/${id}`;
  },
  fetchProductsById(id) {
    return `/product/${id}`;
  },
  addToCart() {
    return "/cart/";
  },
  getCart() {
    return "/cart/";
  },
  updateProductQty(id) {
    return `/cart/${id}`;
  },
  deleteProductFromCart(id) {
    return `/cart/${id}`;
  },
  createOrder() {
    return `/order/create`;
  },
  getOrders() {
    return `/order/`;
  },
  getAdminOrders() {
    return `/order/admin`;
  },
  updateAdminOrders(id) {
    return `/order/admin/${id}`;
  },
  getWishlist() {
    return `/wishlist/`;
  },
  wishlistProduct(id) {
    return `/wishlist/${id}`;
  },
  removeWishlistedProduct(id) {
    return `/wishlist/${id}`;
  },
  chat(){
    return `/api/chat`
  },
  recommendations(){
    return `/api/recommendations`
  }
};

export default apiRoutes;
