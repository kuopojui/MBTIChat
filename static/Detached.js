// 聊天機器人
function sendMessage(personality = "Detached") {  //設定預設人格
    console.log("呼叫 sendMessage，選擇人格:", personality);  //測試觸發
    
    let userMessage = document.getElementById("user-input").value.trim();  //取得輸入的內容

    if (userMessage === "") {  
        alert("請輸入內容再發送！");  // 偵測內容
        return;
    }

    document.getElementById("user-input").value = "";  // 清空輸入框
    
    let msgContainer = document.querySelector(".msg-container");  // 獲取對話框容器
    msgContainer.innerHTML += `<div class="user-msg">${userMessage}</div>`;  //顯示輸入的訊息
    scrollToBottom();  // 確保滾動到底部

    fetch("/send_msg", {  //API 請求
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, personality: personality })  // 確保人格傳遞
    })
    .then(response => response.json())
    .then(data => {
        msgContainer.innerHTML += `<div class="bot-msg">${data.response}</div>`;  // 顯示回應
        scrollToBottom();  //滾動到底部
    })
    .catch(error => console.error("API 錯誤:", error));  // 顯示錯誤於控制台
}

// 對話框滾動到底部
function scrollToBottom() {  
    let msgContainer = document.querySelector(".msg-container");  // 獲取對話框容器
    msgContainer.scrollTop = msgContainer.scrollHeight;  // 滾動到底部
}

// ENTER 送出訊息，使用目前人格
document.getElementById("user-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {  // 按下 Enter 時送出訊息
        event.preventDefault();  // 阻止預設換行行為
        sendMessage();  // 使用目前選擇的人格
    }
});

