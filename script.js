const input = document.getElementById("questionInput");
const sendBtn = document.getElementById("sendBtn");
const responseArea = document.getElementById("responseArea");
const codeBlock = document.getElementById("codeBlock");
const tabs = document.querySelectorAll(".tabs button");
const copyBtn = document.getElementById("copyBtn");
const historyList = document.getElementById("historyList");

let currentResponse = {};

// 임시 키워드 기반 응답
const mockResponses = {
  "로그인": {
    html: "<form>로그인 양식</form>",
    css: "form { padding: 20px; }",
    js: "console.log('로그인 로직');"
  },
  "관리자 페이지": {
    html: "// 관리자 페이지는 아직 준비 중이에요.",
    css: "",
    js: "",
    incomplete: true  // 이 부분이 중요!
  }
};

sendBtn.addEventListener("click", () => {
  const question = input.value.trim();
  if (!question) return;

  // 응답 찾기
  const matched = Object.keys(mockResponses).find(key => question.includes(key));
  if (!matched) {
    codeBlock.textContent = "// 아직 학습되지 않은 기능입니다.";
    responseArea.classList.remove("hidden");
    return;
  }

  currentResponse = mockResponses[matched];
  showCode("html");
  responseArea.classList.remove("hidden");

  saveToHistory(question, currentResponse);
});

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    showCode(tab.dataset.lang);
  });
});

function showCode(lang) {
  codeBlock.textContent = currentResponse[lang] || "// 코드 없음";
}

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(codeBlock.textContent);
  copyBtn.textContent = "복사됨!";
  setTimeout(() => (copyBtn.textContent = "복사"), 1500);
});

function saveToHistory(question, response) {
  const history = JSON.parse(localStorage.getItem("chatHistory") || "[]");
  history.unshift({ question, response });
  localStorage.setItem("chatHistory", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem("chatHistory") || "[]");
  historyList.innerHTML = "";
  history.slice(0, 5).forEach(({ question, response }, idx) => {
    const li = document.createElement("li");
    li.textContent = question;
    li.addEventListener("click", () => {
      currentResponse = response;
      showCode("html");
      responseArea.classList.remove("hidden");
    });
    historyList.appendChild(li);
  });
}

renderHistory();
