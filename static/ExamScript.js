let currentQuestion = 0;

document.addEventListener("DOMContentLoaded", function () {
    const questions = document.querySelectorAll('.questions');

    function showQuestion(index) {
        if (index < 0 || index >= questions.length) {
            console.error(`⚠️ 題目索引錯誤: ${index}`);
            return;
        }

        questions.forEach(q => q.style.display = "none");
        questions[index].style.display = "block";
    }

    document.querySelectorAll(".custom-radio input[type='radio']").forEach((radio) => {
        radio.addEventListener("change", function() {
            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                showQuestion(currentQuestion);
            } else {
                submitQuiz(); // ✅ 只有最後一題才執行
            }
        });
    });

    function submitQuiz() {
        if (currentQuestion !== questions.length - 1) {
            console.log("⚠️ 阻止非最後一題執行 submitQuiz()");
            return;
        }

        let answerCounts = { A: 0, B: 0, C: 0, D: 0, E: 0 };
        const selectedAnswers = document.querySelectorAll('input[type="radio"]:checked');

        if (selectedAnswers.length === 0) {
            alert("請選擇至少一個選項！");
            return;
        }

        selectedAnswers.forEach(answer => {
            if (answerCounts.hasOwnProperty(answer.value)) {
                answerCounts[answer.value]++;
            }
        });

        // 使用 reduce() 找出最高分選項
        let highestValue = Object.keys(answerCounts).reduce((a, b) => answerCounts[a] > answerCounts[b] ? a : b, "A");

        // 如果有多個最高分，隨機選擇其中一個
        let topAnswers = Object.keys(answerCounts).filter(key => answerCounts[key] === answerCounts[highestValue]);
        let finalAnswer = topAnswers[Math.floor(Math.random() * topAnswers.length)];



        setTimeout(() => {
            fetch('/flask-result', {  
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ result: highestValue })  
            })
            .then(response => response.json())
            .then(data => {
                window.location.href = data.redirect;
            })
            .catch(error => {
                console.error('錯誤:', error);
            });
        }, 2000);
    }

    showQuestion(0);
});
