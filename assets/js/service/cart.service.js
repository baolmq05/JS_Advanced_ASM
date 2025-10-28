import { API_URL } from "../../../enviroment/enviroment.js";
import { ENDPOINT, STATUS } from "../../../config/config.js";

export class Cart {
  cartList = [];

  getCartList() {
    return this.cartList;
  }

  async cartLoadData() {
    await axios.get(API_URL + ENDPOINT.CART).then(response => {
      if (response.status == STATUS.OK) {
        this.cartList = response.data;
      }
    }).catch(error => console.error(error));
  }

  cartRender(cartDetails, productList) {
    let html = ``;
    let totalPrice = 0;
    let productQuantity = 0;

    cartDetails.forEach(element => {
      let productItem = productList.find(item => item.id == element.product_id);
      let variant = productItem.product_variants.find(item => item.id == element.variant_id);

      let htmlItem = `<li class="list-group-item px-4 py-3">
                <div class="row align-items-center g-3">
                  <div class="col-12 col-sm-2 text-center">
                    <img src="${variant.image}" class="img-fluid rounded"
                      alt="" style="max-height: 80px;">
                  </div>

                  <div class="col-12 col-sm-4">
                    <h5 class="mb-0 fs-6"><a class="text-decoration-none text-dark" href="./product-detail.html?${productItem.id}">${variant.variant_name}</a></h5>
                  </div>

                  <div class="col-6 col-sm-3">
                    <div class="input-group input-group-sm">
                      <button class="btn btn-outline-secondary" type="button">-</button>
                      <input type="number" class="form-control text-center" value="${element.quantity}" min="1">
                      <button class="btn btn-outline-secondary" type="button">+</button>
                    </div>
                  </div>

                  <div class="col-4 col-sm-2 text-sm-end">
                    <p class="fw-bold text-dark mb-0">${this.formatPrice(variant.price)}</p>
                  </div>

                  <div class="col-2 col-sm-1 text-end">
                    <button class="btn btn-sm btn-outline-danger border-0">
                      <i class="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </div>
              </li>`

      html += htmlItem;
      productQuantity += 1;
      totalPrice += variant.price;
    });

    return {
      html: html,
      total_price: totalPrice,
      quantity: productQuantity
    };
  }

  create(user_id) {
    let objectToCreate = {
      "user_id": user_id,
      "cart_details": []
    }

    axios.post(API_URL + ENDPOINT.CART, objectToCreate).then(response => {
      if (response.status == STATUS.CREATED) {
        console.log("Tạo giỏ hàng thành công");
      }
    }).catch(error => console.error(error));
  }

  update(cartId, productId, variantId, unitPrice, quantity) {
    // Tìm cart hiện tại để thay thế
    let cartCurrent = this.cartList.find(item => item.id == cartId);
    let cartDetails = cartCurrent.cart_details;

    let productExisting = cartDetails.findIndex(item => (item.variant_id == variantId && item.product_id == productId));
    if (productExisting != -1) {
      let newQuantity = quantity + cartDetails[productExisting].quantity;

      console.log(newQuantity);

      let newObject = {
        id: cartDetails[productExisting].id,
        product_id: productId,
        variant_id: variantId,
        unit_price: unitPrice,
        quantity: newQuantity
      }

      cartDetails[productExisting] = newObject;
      console.log(cartDetails);
    } else {
      let idToAdd = Math.random().toString(36).substring(2, 6);

      let newObject = {
        id: idToAdd,
        product_id: productId,
        variant_id: variantId,
        unit_price: unitPrice,
        quantity: quantity
      }

      cartDetails.push(newObject);

      console.log(cartDetails);
    }

    cartCurrent.cart_details = cartDetails;

    console.log(cartCurrent);

    axios.put(API_URL + ENDPOINT.CART + "/" + cartId, cartCurrent).then(response => {
      if (response.status == STATUS.OK) {
        alert("Thêm thành công");
      }
    }).catch(error => console.error(error));
  }

  delete(cart_id) {
    axios.delete(API_URL + ENDPOINT.CART + "/" + cart_id).then(response => {
      if (response.status == STATUS.DELETED) {
        console.log("Delete thành công");
      }
    }).catch(error => console.error(error));
  }

  formatPrice(x) {
    let newNumber = x.toLocaleString('vi', { style: 'currency', currency: 'VND' });
    return newNumber;
  }
}