def api_controller(app):
    from controller.user_router import user_router

    app.include_router(user_router, prefix='/users', tags=['Users'])
