def api_controller(app):
    from controller.event_router import event_router
    from controller.registration_router import registration_router

    app.include_router(event_router, prefix='/events', tags=['Events'])
    app.include_router(registration_router, prefix='/registrations', tags=['Registrations'])