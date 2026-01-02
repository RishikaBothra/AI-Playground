@router.patch("/rename/{chat_id}")
async def rename_chat(chat_id: int, request: Request, db: Session = Depends(get_db)):
    body = await request.json()
    name = body.get("name")

    user_id = getattr(request.state, "user", None)
    if user_id is None:
        raise HTTPException(status_code=401, detail="Unauthorized")

    chat = db.query(Chat).join(Project).filter(
        Chat.id == chat_id,
        Project.user_id == user_id
    ).first()

    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    chat.name = name
    db.commit()

    return {"message": "Chat renamed"}
