{
  let disabled = false;

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
  const btnModalConfirm = document.getElementById("modalResponse-btn_submit");
  const btnModalCancel = document.getElementById("modalResponse-btn_cancel");
  const btnOpenModalResponse = document.getElementById("btnOpenModalResponse");

  // Input
  const keywordInput = document.getElementById("keyword");
  const passwordInput = document.getElementById("password");

  //Reactive input
  var staffInfo = {};
  staffInfo.staff_id = keywordInput.value;
  staffInfo.real_name = passwordInput.value;
  staffInfo.birth_date = null;

  keywordInput.addEventListener("input", (e) => {
    staffInfo.staff_id = e.target.value; // Update on every keystroke
  });

  passwordInput.addEventListener("input", (e) => {
    staffInfo.real_name = e.target.value;
  });

  // Wrapper
  const wrapperConfirmRightItem = document.getElementById("passwordConfirmBox");
  const tableDetailPenalty = document.getElementById("tableDetail");
  const resultSearch = document.getElementById("resultSearch");
  const countdownElement = document.getElementById("countdown");
  const modal = document.getElementById("modalResponse");
  const expiredRightItemMessage = document.getElementById("expiredRightItem");
  const resultSearchMessage = document.getElementById("resultDetail");

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
    if (disabled) return;
    if (wrapperConfirmRightItem.innerHTML) return;
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
              <p id="errorMessage"></p>
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
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth", // Optional: adds smooth animation
    });
    const destroyBtn = document.getElementById("desTroyBtn");
    const btnTypeRightButton = document.getElementById("confirm-btn_type");
    const confirmPasswordInput = document.getElementById("password-right");
    if (confirmPasswordInput) confirmPasswordInput.focus();
    if (destroyBtn) {
      destroyBtn.addEventListener("click", () => {
        wrapperConfirmRightItem.innerHTML = ""; // or hide box
        resultSearch.classList.remove("show");
        tableDetailPenalty.classList.remove("show");
        keywordInput.value = "";
        passwordInput.value = "";
        confirmPasswordInput.value = "";
      });
    }
    btnTypeRightButton.addEventListener("click", () =>
      togglePassword(confirmPasswordInput, btnTypeRightButton)
    );
  };

  const onShowPenaltyDetail = () => {
    tableDetailPenalty.classList.add("show");
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth", // Optional: adds smooth animation
    });
  };

  btnIconGroupKeyword.addEventListener("click", () =>
    onResetInput(keywordInput)
  );
  btnIconGroupPassword.addEventListener("click", () =>
    onResetInput(passwordInput)
  );
  btnToggleTypeInputPassword.addEventListener("click", () =>
    togglePassword(passwordInput, btnToggleTypeInputPassword)
  );
  btnConfirmRightItem.addEventListener("click", () => onShowConfirmBox());
  btnShowDetailPenalty.addEventListener("click", () => onShowPenaltyDetail());

  btnHideDetailPenalty.addEventListener("click", () =>
    tableDetailPenalty.classList.remove("show")
  );

  formSearch.addEventListener("submit", (event) => {
    event.preventDefault();
    resultSearchMessage.innerHTML =
      "✅ Thời gian xác nhật lúc 07/07/2025 22h15p";
    resultSearchMessage.classList.add("result-detail");
    resultSearch.classList.add("show");
    onShowConfirmBox();
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth", // Optional: adds smooth animation
    });

    //reactive input
    const passwordInput = document.getElementById("password-right");
    let timeoutId; // Stores the timeout reference

    passwordInput.addEventListener("input", (e) => {
      // Clear the previous timeout (if any)
      clearTimeout(timeoutId);

      // Set a new timeout (e.g., 500ms delay)
      timeoutId = setTimeout(() => {
        staffInfo.birth_date = e.target.value;
        console.log(staffInfo);
      }, 100); // Adjust delay (in milliseconds) as needed
    });
  });

  btnModalConfirm.addEventListener(
    "click",
    () => (modal.style.display = "none")
  );
  btnModalCancel.addEventListener(
    "click",
    () => (modal.style.display = "none")
  );
  btnOpenModalResponse.addEventListener("click", () => {
    if (disabled) return;
    if (btnConfirmRightItem.disabled) console.log("object");
    const input = document.getElementById("password-right");
    if (!input || !input.value) {
      onShowConfirmBox();
      const errorMessage = document.getElementById("errorMessage");
      errorMessage.classList.add("errorMessage");
      errorMessage.innerText = "Vui lòng điền thông tin";
      return;
    }
    if (input.value) modal.style.display = "flex";
  });

  window.addEventListener("scroll", onScrollContactBox);

  const getEndDate = (now) => {
    const year = now.getFullYear();
    const month = now.getMonth();
    const thirteenth = new Date(year, month, 13, 0, 0, 0);

    if (now < thirteenth) {
      return new Date(year, month, 12, 0, 0, 0);
    } else {
      return new Date(year, month + 1, 12, 0, 0, 0);
    }
  };

  setInterval(() => {
    const now = new Date();
    const endDate = getEndDate(now);
    const startDate = new Date(now.getFullYear(), now.getMonth(), 13, 0, 0, 0);

    if (now >= endDate && now < startDate) {
      countdownElement.innerHTML = `-ngày-giờ-phút-giây`;
      disabled = true;
      btnConfirmRightItem.setAttribute("disabled", disabled);
      btnOpenModalResponse.setAttribute("disabled", disabled);
      expiredRightItemMessage.innerText =
        "⚠️ Thông tin đã hết hạn. Vui lòng liên hệ để cập nhật";
      expiredRightItemMessage.classList.add("errorMessage");
    } else {
      const timeLeft = countdown(now, endDate);

      countdownElement.innerHTML = `
    ${timeLeft.days}ngày ${timeLeft.hours}giờ ${timeLeft.minutes}phút ${timeLeft.seconds}giây
  `;
    }
  }, 1000);

  function getTimeSheetByName() {
    google.script.run
      .withSuccessHandler(function (result) {
        console.log("Success:", result);
        // do something with result
      })
      .withFailureHandler(function (error) {
        console.error("Error:", error.message);
        // show error message to user
      })
      .getTimeSheetByName(staffInfo); //dev
  }
}
