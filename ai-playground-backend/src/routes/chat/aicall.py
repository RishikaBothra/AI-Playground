from src.bots import sarvambot, geminibot


async def aicall(bot_provider: str, context: str) -> str:
    if bot_provider == "gemini":
        return await geminibot.get_response(context)
    elif bot_provider == "sarvam":
        return await sarvambot.get_response(context)
    else:
        return "Unsupported bot provider"
