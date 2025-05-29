const player = document.getElementById("player");
const coins = document.querySelectorAll(".coin");
const goal = document.getElementById("goal");
const clearBox = document.getElementById("clearBox");
const memoryText = document.getElementById("memoryText");
const nextStageBtn = document.getElementById("nextStageBtn");
const introBox = document.getElementById("introBox");
const startBtn = document.getElementById("startBtn");
const haruCounter = document.getElementById("haruCounter");
const coinMessage = document.getElementById("coinMessage");
const coinMessageText = document.getElementById("coinMessageText"); // 定義
const quizPopup = document.getElementById("quizPopup");

let collectedCoinIds = JSON.parse(localStorage.getItem("collectedCoins") || "[]");


function showCustomAlert(message) {
  const msg = document.createElement("div");
  msg.textContent = message;
  msg.style.position = "fixed";
  msg.style.top = "55px";
  msg.style.left = "20px";
  msg.style.transform = "none";
  msg.style.background = "#b3e5fc";
  msg.style.color = "#01579b";
  msg.style.fontWeight = "bold";
  msg.style.fontSize = "18px"; // 👈 サイズUP
  msg.style.padding = "14px 28px"; // 👈 少し大きく
  msg.style.borderRadius = "16px"; // 👈 もっと丸く
  msg.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
  msg.style.zIndex = "9999";
  msg.style.fontFamily = "'Zen Maru Gothic', sans-serif";
  msg.style.transition = "opacity 0.3s";
  msg.style.opacity = "0.95";
  document.body.appendChild(msg);



  setTimeout(() => {
    msg.style.opacity = "0";
    setTimeout(() => msg.remove(), 300);
  }, 5000);
}




document.addEventListener("DOMContentLoaded", () => {
  const clickSound = document.getElementById("clickSound");

  document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});
      }
    });
  });

  const bgm = document.getElementById("bgm");
  if (bgm) {
    bgm.volume = 0.2;
  }
});


function showQuiz(question, answers, correctAnswer, onComplete, sourceElement = null) {
  clearTimeout(quizTimer);
  clearInterval(countdownInterval);

  // 🎵 クイズ表示音
  const quizOpenSound = document.getElementById("quizOpenSound");
  if (quizOpenSound) quizOpenSound.play();

  quizPopup.innerHTML = "";
  quizPopup.dataset.answered = "false";

  const questionEl = document.createElement("p");
  questionEl.textContent = question;
  quizPopup.appendChild(questionEl);

  answers.forEach(ans => {
    const btn = document.createElement("button");
    btn.textContent = ans;
    btn.className = "quizPopup button";
    btn.style.margin = "5px";

    btn.onclick = () => {
      if (quizPopup.dataset.answered === "true") return;
      quizPopup.dataset.answered = "true";

      const isCorrect = ans === correctAnswer;

      // 🎵 正解・不正解 音
      const correctSound = document.getElementById("quizCorrectSound");
      const wrongSound = document.getElementById("quizWrongSound");
      if (isCorrect && correctSound) correctSound.play();
      if (!isCorrect && wrongSound) wrongSound.play();

      // 💰 コイン加算（正解時）
      if (isCorrect) {
        haruCount += 1;
        localStorage.setItem("haruCount", haruCount);
        if (haruCounter) haruCounter.textContent = `haru: ${haruCount}`;
      }

      // 🎀 カスタムアラート
      showCustomAlert(
        isCorrect
          ? "🍬 Perfect! A harucoin just for you!"
          : "😢 Oops! No harucoin this time, but keep going!"
      );

      // 💬 正解時のみ吹き出し表示
      const coinMsgText = document.getElementById("coinMessageText");
      const coinMessage = document.getElementById("coinMessage");
      const photoBox = document.getElementById("memoryPhotoBox");
      const coinImage = document.getElementById("memoryPhoto");

      if (isCorrect && sourceElement) {
        const memory = sourceElement.dataset.memory || "memory!";
        const image = sourceElement.dataset.img || "";

        coinMsgText.textContent = memory;
        if (coinImage) coinImage.src = image;
        if (coinMessage) coinMessage.style.display = "flex";
        if (photoBox) photoBox.style.display = "block";

        const closeBtn = document.getElementById("closeMemoryPhoto");
        if (closeBtn) {
          closeBtn.onclick = () => {
            photoBox.style.display = "none";
          };
        }
      } else {
         // ❌ 不正解時は全リセット（ここが重要！）
  if (coinMsgText) coinMsgText.textContent = "";
  if (coinImage) coinImage.src = "";
  if (coinMessage) coinMessage.style.display = "none";
  if (photoBox) photoBox.style.display = "none";
}

      quizPopup.style.display = "none";
      onComplete(isCorrect);
    };

    quizPopup.appendChild(btn);
  });

  quizPopup.style.display = "block";
}



// 初期化時に画像設定（超重要）
document.querySelectorAll(".gallery-item").forEach(item => {
  const imgUrl = item.dataset.img;
  if (imgUrl) {
    item.style.backgroundImage = `url('${imgUrl}')`;
  }

  const id = item.dataset.id;
  const unlocked = JSON.parse(localStorage.getItem("galleryUnlocks") || "[]");
  if (unlocked.includes(id)) {
    item.style.display = "none";
  } else {
    item.style.display = "block";
  }
});

// 最初にコインを非表示にする
coins.forEach(coin => {
  const coinId = coin.dataset.id;
  if (collectedCoinIds.includes(coinId)) {
    coin.classList.add("collected");
    coin.style.display = "none";
  }
});

// haruカウントをローカルから取得
let haruCount = parseInt(localStorage.getItem("haruCount") || "0");
if (haruCounter) {
  haruCounter.textContent = `haru: ${haruCount}`;
}

let x = 100;
let y = window.innerHeight / 2;
const speed = 5;
let gameStarted = false;

const keys = { w: false, a: false, s: false, d: false };

document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() in keys) keys[e.key.toLowerCase()] = true;
});
document.addEventListener("keyup", (e) => {
  if (e.key.toLowerCase() in keys) keys[e.key.toLowerCase()] = false;
});

const stageMap = {
  "game.html": "game2.html",
  "game2.html": "game3.html",
  "game3.html": "game4.html",
  "game4.html": null,
  "newstage1.html": "newstage2.html",
  "newstage2.html": null  // ← これで ending.html に進む対象になる
};


const memoryPerStage = {
  "game.html": "✈️ We had many momery and get good relationship",
  "game2.html": "We met and checked if we love each other",
  "game3.html": "🛬 needed to hold our mind that we can meet again TT",
  "game4.html": "I love you so much and excited to meet you again!",
  "newstage1.html": "Finally you finished univercity",
  "newstage2.html": "Thank you for playing this game!"


};

function getStageFilename() {
  const path = location.pathname;
  return path.substring(path.lastIndexOf("/") + 1);
}

function getNextStage() {
  const file = getStageFilename();
  return stageMap[file] || null;
}

function showClearScreen() {
  gameStarted = false;
  const file = getStageFilename();
  const memory = memoryPerStage[file] || "Cleared This stage!";
  memoryText.textContent = "Our Memory：" + memory;
  clearBox.style.display = "flex";
  localStorage.setItem(file + "_cleared", "true");
}

nextStageBtn.addEventListener("click", () => {
  const next = getNextStage();
  const current = getStageFilename();

  if (next) {
    // 特別ステージチェック：newstage1 → newstage2
    if (current === "newstage1.html") {
      const purchased = localStorage.getItem("specialStage2Purchased");
      if (purchased === "true") {
        window.location.href = "newstage2.html";
      } else {
        alert("❌ You haven't bought this stage yet. go to shop now");
        window.location.href = "haru-coin.html"; // ✅ 強制遷移！
      }
    } else {
      window.location.href = next;
    }
  } else {
    // エンディング分岐
    if (current === "newstage2.html") {
      window.location.href = "ending2.html";
    } else {
      window.location.href = "ending.html";
    }
  }
});




if (startBtn) {
  startBtn.addEventListener("click", () => {
    introBox.style.display = "none";
    gameStarted = true;
    gameLoop();
  });
}

function checkCollision(rect1, rect2) {
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

function gameLoop() {
  if (!gameStarted) {
    requestAnimationFrame(gameLoop);
    return;
  }

  // 仮の移動先を計算
  let nextX = x;
  let nextY = y;

  if (keys.w) nextY -= speed;
  if (keys.s) nextY += speed;
  if (keys.a) nextX -= speed;
  if (keys.d) nextX += speed;

  // 仮移動して判定
  player.style.left = nextX + "px";
  player.style.top = nextY + "px";
  const playerRect = player.getBoundingClientRect();

  // 障害物との衝突をチェック
  let blocked = false;
  const obstacles = document.querySelectorAll(".obstacle");
  obstacles.forEach(ob => {
    const obsRect = ob.getBoundingClientRect();
    if (checkCollision(playerRect, obsRect)) {
      blocked = true;
    }
  });

  // 実移動（衝突がない場合）
  if (!blocked) {
    x = nextX;
    y = nextY;
  }

  // 表示更新
  player.style.left = x + "px";
  player.style.top = y + "px";

  // コイン取得処理
  coins.forEach((coin) => {
    const coinId = coin.dataset.id;
    const coinRect = coin.getBoundingClientRect();

    if (
      !coin.classList.contains("collected") &&
      !collectedCoinIds.includes(coinId) &&
      checkCollision(playerRect, coinRect)
    ) {
      coin.classList.add("collected");
      coin.style.display = "none";
      haruCount++;
      localStorage.setItem("haruCount", haruCount);
      haruCounter.textContent = `haru: ${haruCount}`;

      // IDを保存
      collectedCoinIds.push(coinId);
      localStorage.setItem("collectedCoins", JSON.stringify(collectedCoinIds));

    
      // クイズ処理
       const q = coin.dataset.question;
       const a = coin.dataset.answers?.split(",");
        const c = coin.dataset.correct;
      const memoryMsg = coin.dataset.memory;

      showQuiz(q, a, c, (isCorrect) => {
  if (isCorrect) {
    // ✅ 正解時のみ吹き出し表示
    if (memoryMsg && coinMessageText && coinMessage) {
      coinMessageText.textContent = memoryMsg;
      coinMessage.style.display = "flex";
    }

    // ✅ 思い出画像も表示（オプション）
    const photoBox = document.getElementById("memoryPhotoBox");
    const coinImage = document.getElementById("memoryPhoto");
    const img = coin.dataset.img;

    if (photoBox && coinImage && img) {
      coinImage.src = img;
      photoBox.style.display = "block";
    }

  } else {
    // ❌ 不正解時はすべて非表示に
    const coinMessage = document.getElementById("coinMessage");
    const photoBox = document.getElementById("memoryPhotoBox");
    const coinImage = document.getElementById("memoryPhoto");
    const coinMsgText = document.getElementById("coinMessageText");

    if (coinMessage) coinMessage.style.display = "none";
    if (photoBox) photoBox.style.display = "none";
    if (coinImage) coinImage.src = "";
    if (coinMsgText) coinMsgText.textContent = "";
  }
}, coin);


        }

    }


  );

  if (closeCoinMsg) {
    closeCoinMsg.addEventListener("click", () => {
      coinMessage.style.display = "none";
    });
  }

  // ゴール出現条件
  const remainingCoins = document.querySelectorAll(".coin:not(.collected)");
  if (remainingCoins.length === 0) {
    goal.style.display = "block";
  }

  const goalRect = goal.getBoundingClientRect();
if (goal.style.display === "block" && checkCollision(playerRect, goalRect)) {
  const goalSound = document.getElementById("goalSound");
  if (goalSound) {
    goalSound.currentTime = 0;
    goalSound.play().catch(() => {});
  }
  showClearScreen();
}

  requestAnimationFrame(gameLoop);

// ✅ gallery-item 処理（coin方式に変更）
const galleryItems = document.querySelectorAll(".gallery-item");

galleryItems.forEach(item => {
  const id = item.dataset.id;
  const unlocked = JSON.parse(localStorage.getItem("galleryUnlocks") || "[]");

  if (unlocked.includes(id)) {
    item.style.display = "none";
    return;
  }

  const rect = item.getBoundingClientRect();
  const playerRect = player.getBoundingClientRect();

  if (checkCollision(playerRect, rect)) {
    item.style.display = "none";
    unlocked.push(id);
    localStorage.setItem("galleryUnlocks", JSON.stringify(unlocked));

    const q = item.dataset.question;
    const a = item.dataset.answers?.split(",");
    const c = item.dataset.correct;
    const img = item.dataset.img;
    const memory = item.dataset.memory || "📸 Got memory";

    showQuiz(q, a, c, (isCorrect) => {
      if (isCorrect) {
        const coinMsgText = document.getElementById("coinMessageText");
        const coinMessage = document.getElementById("coinMessage");
        const photoBox = document.getElementById("memoryPhotoBox");
        const coinImage = document.getElementById("memoryPhoto");

        if (coinMsgText) coinMsgText.textContent = memory;
        if (coinMessage) coinMessage.style.display = "flex";
        if (coinImage && img) coinImage.src = img;
        if (photoBox) photoBox.style.display = "block";

        const closeBtn = document.getElementById("closeMemoryPhoto");
        if (closeBtn) {
          closeBtn.onclick = () => {
            photoBox.style.display = "none";
          };
        }
      } else {
        alert("❌ incorrect! you need to remember!");
      }
    }, item);
  }
});


  
  

};

if (goal) {
  goal.addEventListener("click", () => {
    if (goal.style.display === "block") {
      showClearScreen();
    }
  });
}

function goBackStage() {
  const file = getStageFilename();
  const backMap = {
    "game2.html": "game.html",
    "game3.html": "game2.html",
    "game4.html": "game3.html",
    "game.html": "index2.html" // 最初のステージはタイトルへ戻る
  };
  const back = backMap[file];
  if (back) {
    window.location.href = back;
  } else {
    alert("you can't back more");
  }
}

document.getElementById("resetHaruBtn").onclick = () => {
  if (confirm("Do you want to reset your coin?")) {
    localStorage.removeItem("haruCount");
    localStorage.removeItem("collectedCoins");
    localStorage.removeItem("galleryUnlocks");
    localStorage.removeItem("attemptedGalleries");
    location.reload();
  }
};

let quizTimer;
let countdownInterval;




