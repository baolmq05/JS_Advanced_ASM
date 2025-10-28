import { API_URL } from "../../../enviroment/enviroment.js";
import { ENDPOINT, STATUS } from "../../../config/config.js";

export class Category {
    #id;
    #name;
    #parent_id;

    #categoryList = [];
    #categoryOne;

    getCategoryList() {
        return this.categoryList;
    }

    getCategoryOne() {
        return this.categoryOne;
    }

    async categoryLoadData() {
        await axios.get(API_URL + ENDPOINT.CATEGORY).then(response => {
            if (response.status === STATUS.OK) {
                this.categoryList = response.data;
            }
        }).catch(error => console.error(error));
    }

    categoryRenderInShop() {
        let htmlList = ``;

        htmlList += `
            <a href="./product.html" class="list-group-item list-group-item-action" aria-current="true">
                Tất cả sản phẩm
            </a>
        `

        let index = 0;
        for (let i = 0; i < (this.categoryList.length); i++) {
            if (this.categoryList[i].status == 1) {
                if (this.categoryList[i].parent_id == null || this.categoryList[i].parent_id == "") {
                    index += 1;
                    let htmlItem = `<div class="dropdown">
                                    <button class="btn list-group-item list-group-item-action w-100 dropdown-toggle" type="button"
                                        id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                        ${this.categoryList[i].name}
                                    </button>
                                    <ul class="dropdown-menu w-100" aria-labelledby="dropdownMenuButton">`;

                    for (let j = i + 1; j < this.categoryList.length; j++) {
                        if (this.categoryList[j].status == 1) {
                            if (this.categoryList[j].parent_id == this.categoryList[i].id) {
                                index += 1;
                                let htmlItemChild = `<li><a class="dropdown-item" href="./product.html?${this.categoryList[j].id}">${this.categoryList[j].name}</a></li>`;
                                htmlItem += htmlItemChild;
                            }
                        }
                    }

                    htmlItem += `</ul>
                            </div>`;

                    htmlList += htmlItem;
                }
            }
        }

        return htmlList;
    }
}