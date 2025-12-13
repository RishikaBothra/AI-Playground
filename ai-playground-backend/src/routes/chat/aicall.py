from src.bots import sarvambot, geminibot


async def aicall(bot_provider: str, model_name: str | None, context: str) -> str:
    """Unified AI call helper.

    Parameters:
    - bot_provider: 'sarvam' or 'gemini'
    - model_name: provider-specific model name (optional)
    - context: the prompt/context to send to the model
    """
    if bot_provider == "sarvam":
        # sarvambot exposes a small get_response helper
        response = await sarvambot.get_response(model_name, context)
        return response
    elif bot_provider == "gemini":
        response = await geminibot.get_response(model_name, context)
        return response
    else:
        return "Bot provider not supported"