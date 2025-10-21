import { User } from "../../../service/user.service.js";

const user = new User();

async function userLoading() {
    await user.userLoadData();
    let userHTML = user.userRender();
    document.querySelector("#user-list").innerHTML = userHTML;

    findByName();
    findByStatus();
}

const findByName = () => {
    searchEventHandle();
};

const findByStatus = () => {
    statusEventHandle();
};

const statusEventHandle = () => {
    const statusChange = document.querySelector("#status_change");
    statusChange.addEventListener("change", () => {
        let valueChange = statusChange.value;

        let userHTML;

        if (valueChange == "") {
            userHTML = user.userRender();
        } else {
            userHTML = user.userRenderByStatus(valueChange);
        }

        document.querySelector("#user-list").innerHTML = "";
        document.querySelector("#user-list").innerHTML = userHTML;
    })
};

const searchEventHandle = () => {
    let searchInput = document.querySelector("#search_input");

    searchInput.addEventListener("keyup", (event) => {
        if (searchInput.value == "") {
            let userHTML = user.userRender();
            document.querySelector("#user-list").innerHTML = userHTML;
            return;
        }

        let userHTML = user.userRenderByName(searchInput.value);
        document.querySelector("#user-list").innerHTML = "";
        document.querySelector("#user-list").innerHTML = userHTML;
    });
};

userLoading();
