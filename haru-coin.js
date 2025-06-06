
  document.addEventListener("DOMContentLoaded", () => {
    const clickSound = document.getElementById("clickSound");

    document.querySelectorAll("button").forEach(button => {
      button.addEventListener("click", () => {
        if (clickSound) {
          clickSound.currentTime = 0;
          clickSound.play().catch(() => {});
        }
      });
    });
  });





function goBack() {
  history.back();
}

const haruKey = "haruCount";
const total = document.getElementById("haruTotal");
let haruCount = parseInt(localStorage.getItem(haruKey) || "0");
total.textContent = haruCount;

const buyStage1Btn = document.getElementById("buyStage1Btn");
const buyStage2Btn = document.getElementById("buyStage2Btn");

// 購入済みチェック
if (localStorage.getItem("specialStage1Purchased") === "true") {
  buyStage1Btn.textContent = "already bought it";
  buyStage1Btn.disabled = true;
}
if (localStorage.getItem("specialStage2Purchased") === "true") {
  buyStage2Btn.textContent = "already bought it";
  buyStage2Btn.disabled = true;
}

// 購入処理1
buyStage1Btn.addEventListener("click", () => {
  if (haruCount >= 15) {
    haruCount -= 15;
    localStorage.setItem(haruKey, haruCount);
    localStorage.setItem("specialStage1Purchased", "true");
    total.textContent = haruCount;
    buyStage1Btn.textContent = "購入済み";
    buyStage1Btn.disabled = true;
    alert("You bought Special Stage1");
  } else {
    alert("You dont have enough coins");
  }
});

// 購入処理2
buyStage2Btn.addEventListener("click", () => {
  if (haruCount >= 15) {
    haruCount -= 15;
    localStorage.setItem(haruKey, haruCount);
    localStorage.setItem("specialStage2Purchased", "true");
    total.textContent = haruCount;
    buyStage2Btn.textContent = "購入済み";
    buyStage2Btn.disabled = true;
    alert("You bought Special Stage2");
  } else {
    alert("You dont have enough coins");
  }
});

// リセットボタン
const resetBtn = document.getElementById("resetShopBtn");
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    if (confirm("Do you want to reset this shop?")) {
      localStorage.removeItem(haruKey);
      localStorage.removeItem("specialStage1Purchased");
      localStorage.removeItem("specialStage2Purchased");
      location.reload();
    }
  });
}
