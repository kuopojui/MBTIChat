// 聊天機器人
function sendMessage(personality = "Supporter") {  // 設定預設人格，防止錯誤
    console.log("呼叫 sendMessage，選擇人格:", personality);  // 測試是否被觸發
    
    let userMessage = document.getElementById("user-input").value.trim();  // 取得使用者輸入的內容

    if (userMessage === "") {  
        alert("請輸入內容再發送！");  // 如果輸入為空，顯示警告並終止
        return;
    }

    document.getElementById("user-input").value = "";  // 清空輸入框
    
    let msgContainer = document.querySelector(".msg-container");  // 獲取對話框容器
    msgContainer.innerHTML += `<div class="user-msg">${userMessage}</div>`;  // 顯示使用者輸入的訊息
    scrollToBottom();  // 確保滾動到底部

    fetch("/send_msg", {  // 發送 API 請求
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, personality: personality })  // 確保人格正確傳遞
    })
    .then(response => response.json())
    .then(data => {
        msgContainer.innerHTML += `<div class="bot-msg">${data.response}</div>`;  // 顯示 AI 回應
        scrollToBottom();  // 滾動到底部
    })
    .catch(error => console.error("API 錯誤:", error));  // 捕捉錯誤並顯示於控制台
}

// 對話框滾動到底部
function scrollToBottom() {  
    let msgContainer = document.querySelector(".msg-container");  // 獲取對話框容器
    msgContainer.scrollTop = msgContainer.scrollHeight;  // 🔥 滾動到底部
}

// ENTER 送出訊息，使用目前選擇的 AI 人格
document.getElementById("user-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {  // 按下 Enter 時送出訊息
        event.preventDefault();  // 阻止預設換行行為
        sendMessage();  // 使用目前選擇的 AI 人格，而不是固定 "Analyst"
    }
});
