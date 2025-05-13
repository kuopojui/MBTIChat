from dotenv import load_dotenv
import os
import openai

# 載入 .env 文件
load_dotenv("APIKey.env")

# 讀取 API 金鑰
openai.api_key = os.getenv("OPENAI_API_KEY")

# 測試 API
response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "你好！"}]
)

print(response["choices"][0]["message"]["content"])