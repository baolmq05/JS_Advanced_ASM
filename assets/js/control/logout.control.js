const logoutAction = () => {
    const logoutConfirmBtn = document.querySelector("#logout_confirm_btn");
    logoutConfirmBtn.addEventListener("click", () => {
        sessionStorage.removeItem("client_allow");
        sessionStorage.removeItem("admin_allow");

        sessionStorage.setItem("logout_success", "Đã đăng xuất");

        window.location.href = "http://127.0.0.1:5501/index.html";
    })
};

const logoutEventHandle = () => {
    const logoutBtn = document.querySelector("#logout_BTN");
    logoutBtn.addEventListener("click", () => {
        document.querySelector("#modal_logout").style.display = "block";
    });
};

const closeModalLogout = () => {
    const closeBtn = document.querySelector("#close_modal_logout");
    closeBtn.addEventListener("click", () => {
        document.querySelector("#modal_logout").style.display = "none";
    });
}

logoutEventHandle();
logoutAction();
closeModalLogout();

