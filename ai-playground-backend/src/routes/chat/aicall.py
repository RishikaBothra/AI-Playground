from src.bots import sarvambot, geminibot

async def aicall(bot_provider:str,modelname:str|None,prompt:str)->str:
    if bot_provider == "sarvam":
        response = await sarvambot.get_response(modelname, prompt)
        return response
    elif bot_provider == "gemini":
        response = await geminibot.get_response(modelname, prompt)
        return response
    else:
        return "Bot provider not supported"