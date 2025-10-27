import { User } from "../../../service/user.service.js";

const user = new User();

async function userLoading() {
    await user.userLoadData();
    let userHTML = user.userRender();
    document.querySelector("#user-list").innerHTML = userHTML;
    user.userReplaceTable();

    findByStatus();
}

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
        user.userReplaceTable();
    })
};

userLoading();
