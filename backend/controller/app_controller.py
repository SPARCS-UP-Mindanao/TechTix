def api_controller(app):
    from controller.admin_router import admin_router
    from controller.event_router import event_router
    from controller.registration_router import registration_router
    from controller.file_upload_router import file_upload_router

    app.include_router(event_router, prefix='/events', tags=['Events'])
    app.include_router(registration_router, prefix='/registrations', tags=['Registrations'])
    app.include_router(admin_router, prefix='/admins', tags=['Admins'])
    app.include_router(file_upload_router, prefix='/events/{entryId}/upload', tags=['File upload'])
