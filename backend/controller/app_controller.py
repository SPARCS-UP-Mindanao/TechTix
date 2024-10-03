def api_controller(app):
    from controller.certificate_router import certificate_router
    from controller.discount_router import discount_router
    from controller.evaluation_router import evaluation_router
    from controller.event_router import event_router
    from controller.faqs_controller import faqs_router
    from controller.preregistration_router import preregistration_router
    from controller.registration_router import registration_router
    from controller.payment_controller import payment_router

    app.include_router(event_router, prefix='/events', tags=['Events'])
    app.include_router(registration_router, prefix='/registrations', tags=['Registrations'])
    app.include_router(preregistration_router, prefix='/preregistrations', tags=['PreRegistrations'])
    app.include_router(certificate_router, prefix='/certificates', tags=['Certificates'])
    app.include_router(evaluation_router, prefix='/evaluations', tags=['Evaluations'])
    app.include_router(discount_router, prefix='/discounts', tags=['Discounts'])
    app.include_router(faqs_router, prefix='/faqs', tags=['FAQs'])
    app.include_router(payment_router, prefix='/payments', tags=['Payments'])
