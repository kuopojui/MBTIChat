from dotenv import load_dotenv
import os
import openai

# 載入 .env 檔案
load_dotenv("APIKey.env")

# 設定 OpenAI API 金鑰
openai.api_key = os.getenv("OPENAI_API_KEY")

# 測試 API 連線
response = openai.chat.completions.create(  # 使用新版 API
    model="gpt-4",
    messages=[{"role": "user", "content": "你好！"}]
)

print(response.choices[0].message.content)  # 確保 API 回應正確
