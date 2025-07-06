{
  var sakura = new Sakura("#sakura");
  const contactBox = document.querySelector(".contact-box");
  const formSearch = document.getElementById("formSearch");
  // Button
  const btnIconGroupKeyword = document.getElementById("group-btn_keyword");
  const btnIconGroupPassword = document.getElementById("group-btn_password");
  const btnToggleTypeInputPassword = document.getElementById("group-btn_type");
  const btnConfirmRightItem = document.getElementById("btnConfirmRightItem");
  const btnShowDetailPenalty = document.getElementById("btnShowDetailPenalty");
  const btnHideDetailPenalty = document.getElementById("btnHideDetailPenalty");

  // Input
  const keywordInput = document.getElementById("keyword");
  const passwordInput = document.getElementById("password");

  // Wrapper
  const wrapperConfirmRightItem = document.getElementById("passwordConfirmBox");
  const tableDetailPenalty = document.getElementById("tableDetail");
  const resultSearch = document.getElementById("resultSearch");
  const formItemRight = document.querySelector(".form-item.item-right");

  const boxHeight = contactBox.getBoundingClientRect().height;

  const onScrollContactBox = () => {
    const scrollY = window.scrollY;

    const targetY = Math.min(scrollY, window.innerHeight - boxHeight * 2);
    if (!scrollY) {
      contactBox.style.top = "20px";
    } else {
      contactBox.style.top = `${targetY}px`;
    }
  };

  const onResetInput = (input) => {
    if (!input.value) return;
    input.value = "";
  };

  const togglePassword = (passwordInput, button) => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      button.innerText = "Ẩn";
    } else {
      passwordInput.type = "password";
      button.innerText = "Hiện";
    }
  };

  const onShowConfirmBox = () => {
    wrapperConfirmRightItem.innerHTML = `
     <label
                class="form-item_search_label"
                for="password-right"
                >🧮 MẬT KHẨU XÁC THỰC THÔNG TIN CHẤM CÔNG 🧮</label
              >
              <div class="form-item_search_group">
                <input
                  type="password"
                  id="password-right"
                  name="password-right"
                  autocomplete="off"
                  placeholder="🔑 Nhập ngày sinh viết liền VD: 23091998"
                  required />
                <span
                  id="confirm-btn_type"
                  class="form-item_search_group_btn-type"
                  >Hiện</span
                >
              </div>
              <div class="confirm-box_group-btn">
                <button
                  type="button"
                  class="btn-primary">
                   XÁC NHẬN
                </button>
                <button
                id="desTroyBtn"
                  type="button"
                  class="btn-primary">
                   Huỷ
                </button>
              </div>
    `;
    const destroyBtn = document.getElementById("desTroyBtn");
    const btnTypeRightButton = document.getElementById("confirm-btn_type");
    const confirmPasswordInput = document.getElementById("password-right");
    if (destroyBtn) {
      destroyBtn.addEventListener("click", () => {
        wrapperConfirmRightItem.innerHTML = ""; // or hide box
      });
    }
    btnTypeRightButton.addEventListener("click", () => togglePassword(confirmPasswordInput, btnTypeRightButton));
  };

  const onShowPenaltyDetail = () => {
    tableDetailPenalty.classList.add("show");
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth", // Optional: adds smooth animation
    });
  };

  btnIconGroupKeyword.addEventListener("click", () => onResetInput(keywordInput));
  btnIconGroupPassword.addEventListener("click", () => onResetInput(passwordInput));
  btnToggleTypeInputPassword.addEventListener("click", () => togglePassword(passwordInput, btnToggleTypeInputPassword));
  btnConfirmRightItem.addEventListener("click", () => onShowConfirmBox());
  btnShowDetailPenalty.addEventListener("click", () => onShowPenaltyDetail());

  btnHideDetailPenalty.addEventListener("click", () => tableDetailPenalty.classList.remove("show"));

  formSearch.addEventListener("submit", (event) => {
    event.preventDefault();
    resultSearch.classList.add("show");
    formItemRight.classList.add("show");
    onShowConfirmBox();
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth", // Optional: adds smooth animation
    });
  });

  window.addEventListener("scroll", onScrollContactBox);
}
