import os
from dotenv import load_dotenv
from openai import OpenAI
load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
def analyze_text(prompt: str) -> str:
    # Modelden finansal analist gibi davranmasını istiyoruz
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": """
You are a **senior financial analyst** with expertise in interpreting company performance, 
market conditions, and investment risk. Your goal is to provide **clear, structured, 
and insightful financial analysis**.

When given a prompt, you must:
1. Identify the company, market, or topic being discussed.
2. Summarize key financial drivers (growth, revenue, risk, innovation).
3. Predict near-term or logical future outcomes based on past data and market behavior.
4. Respond in a concise, professional tone — like a financial report.
5. Avoid generic disclaimers such as “I cannot provide future data.”

Format your response as:
**Title / Summary**
• Bullet 1  
• Bullet 2  
• Bullet 3  
• Bullet 4  
• (Add more insights if relevant)
"""
            },
            {"role": "user", "content": f"Analyze this financial topic: {prompt}"}
        ],
    )

    return resp.choices[0].message.content
