def api_controller(app):
    from controller.event_router import event_router

    app.include_router(event_router, prefix='/events', tags=['Events'])
