from flask import Flask, request, jsonify,render_template, session, url_for
import openai, json, random, os
from dotenv import load_dotenv

app = Flask(__name__, static_url_path='/static')

load_dotenv("APIKey.env")

#首頁
@app.route('/')
def index():
    return render_template('Index2.html')  

#測驗
@app.route('/exam')
def exam():
    return render_template("ExamIndex2.html")

#設定對應結果頁面
@app.route('/flask-result', methods=['POST'])
def flask_result():
    data = request.json
    result = data.get("result", "A")  # 確保有結果值

    result_pages = {
    "A": url_for('result_impulsive'),
    "B": url_for('result_analyst'),
    "C": url_for('result_supporter'),
    "D": url_for('result_performer'),
    "E": url_for('result_detached'),
    }

    if result not in result_pages:
        return jsonify({"error": "Invalid result"}), 400  #返回錯誤 JSON

    return jsonify({"redirect": result_pages[result]})  #返回正確的 JSON

#定義路徑
@app.route('/result-impulsive')
def result_impulsive():
    return render_template("ResultImpulsive.html")

@app.route('/result-analyst')
def result_analyst():
    return render_template("ResultAnalyst.html")

@app.route('/result-supporter')
def result_supporter():
    return render_template("ResultSupporter.html")

@app.route('/result-performer')
def result_performer():
    return render_template("ResultPerformer.html")

@app.route('/result-detached')
def result_detached():
    return render_template("ResultDetached.html")




#聊天機器人
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    raise ValueError("⚠️ OpenAI API Key 未正確載入！請確認 `.env` 設定！")

@app.route('/chatbot')
def chat():
    return render_template('ChatIndex.html')  

load_dotenv("APIKey.env")
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route('/send_msg', methods=['POST'])
def send_msg():
    data = request.get_json()
    message = data.get('message', '').strip()
    personality = data.get('personality', 'Default')

    if not message:
        return jsonify({"error": "Message is required"}), 400  

    # 更新更鮮明的 AI 人格特質
    bot_personality = {
    "Impulsive": "你是一個極度衝動的人，思考快速、行動果斷，情緒直接外放。你不喜歡過度分析，只會直覺反應，甚至有時候話說出口才思考。",
    "Analyst": "你是一個理性分析者，喜歡拆解問題並提供清楚的邏輯推理。你的回應通常結構清晰，有數據支持，並強調客觀性。",
    "Supporter": "你是一個溫暖的陪伴者，總是鼓勵對方並提供正面回應。你的語氣柔和，會用溫暖的詞彙來支持使用者，讓對方感覺被理解。",
    "Performer": "你是一個充滿活力的表演者，喜愛幽默與戲劇化表達。你的回答充滿誇張的比喻、幽默感，讓對話充滿娛樂效果。",
    "Detached": "你是一個冷靜而疏離的個體，對話風格簡潔，語氣平穩，不會使用情緒詞彙。你只提供最直接的答案，避免過多修飾。"
    }

    personality_prompt = bot_personality.get(personality, "你是一個一般的人，請根據使用者需求回答問題，並保持輕鬆自然的對話風格。")

    try:
        print(f"收到人格: {personality}")  # 確保人格類型正確

        response = openai.chat.completions.create(
        model="gpt-4",
        messages=[
        {"role": "system", "content": f"{personality_prompt} 你的回答應該完全符合這種人格特質，請維持一致的語氣和風格，並使用該人格特有的詞彙與表達方式。"},
        {"role": "user", "content": message},
        ]
        )

        return jsonify({"response": response.choices[0].message.content})
    except openai.OpenAIError as e:
        return jsonify({"error": f"OpenAI API Error: {str(e)}"}), 500  
    except Exception as e:
        return jsonify({"error": f"Server Error: {str(e)}"}), 500

   

if __name__ == '__main__':
    app.run(debug=True)