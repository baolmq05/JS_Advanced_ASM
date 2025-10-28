import { API_URL } from "../../enviroment/enviroment.js";
import { ENDPOINT, STATUS } from "../../config/config.js";

export class Cart {
    cartList = [];

    getCartList() {
        return this.cartList;
    }

    async cartLoadData() {
        await axios.get(API_URL + ENDPOINT.CART).then(response => {
            if (response.status == STATUS.OK) {
                console.log(response.data);
                this.cartList = response.data;
            }
        }).catch(error => console.error(error));
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

    delete(cart_id) {
        axios.delete(API_URL + ENDPOINT.CART + "/" + cart_id).then(response => {
            if (response.status == STATUS.DELETED) {
                console.log("Delete thành công");
            }
        }).catch(error => console.error(error));
    }
}