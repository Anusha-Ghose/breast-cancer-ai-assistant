"""Translates explanations into regional languages (Hindi, Tamil, Bengali, etc.)."""
import json
from app.services.llm_service import client

def translate(text: str, target_lang: str) -> str:
    lang_map = {
        "hi": "Hindi",
        "ta": "Tamil",
        "bn": "Bengali",
        "en": "English"
    }
    target_lang_name = lang_map.get(target_lang.lower(), target_lang)
    
    if target_lang_name.lower() == "english":
        return text
        
    prompt = f"Translate the following medical text into {target_lang_name}. Return ONLY the translated text without any conversational filler, markdown code blocks, or preamble.\n\nText: {text}"
    
    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {"role": "system", "content": "You are a professional medical translator. Return only the translation."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,
            max_tokens=2048
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Translation failed (maybe missing Groq API key?): {e}")
        # Mock translation for demo purposes
        prefix_map = {
            "hi": "[Hindi Translation] ",
            "ta": "[Tamil Translation] ",
            "bn": "[Bengali Translation] "
        }
        prefix = prefix_map.get(target_lang.lower(), f"[{target_lang_name} Translation] ")
        return prefix + text

def translate_batch(texts: list[str], target_lang: str) -> list[str]:
    lang_map = {
        "hi": "Hindi",
        "ta": "Tamil",
        "bn": "Bengali",
        "en": "English"
    }
    target_lang_name = lang_map.get(target_lang.lower(), target_lang)
    
    if target_lang_name.lower() == "english":
        return texts
        
    prompt = f"""Translate the following medical strings into {target_lang_name}.
Return ONLY a JSON object with a single key "translations" that contains an array of the translated strings in the exact same order.

Texts to translate:
{json.dumps(texts)}"""
    
    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {"role": "system", "content": "You are a professional medical translator. Output valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.1,
            max_tokens=4096
        )
        content = response.choices[0].message.content.strip()
        data = json.loads(content)
        return data.get("translations", texts)
    except Exception as e:
        print(f"Batch translation failed: {e}")
        prefix_map = {
            "hi": "[Hindi Translation] ",
            "ta": "[Tamil Translation] ",
            "bn": "[Bengali Translation] "
        }
        prefix = prefix_map.get(target_lang.lower(), f"[{target_lang_name} Translation] ")
        return [prefix + text for text in texts]
