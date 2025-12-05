const sections = [
        {
            "sectionId": "attachments",
            "title": "آپلود فایل",
            "description": "شما میتوانید تا حداکثر 20 مکاتبات قابل آپلود کنید.",
            "type": 8,
            "style": 1,
            "required": false,
            "size": 20,
            "acceptedFormats": ["image/*", "application/pdf"],
            "formatDescription": "فرمت پشتیبانی باید PDF باشد (حداکثر 800x400px)"
        },
        {
            "sectionId": "time_duration",
            "title": "مدت زمان:",
            "label": "مدت زمان",
            "placeholder": "۱۴۰۴/۰۹/۱۰ تا ۱۴۰۴/۰۹/۲۵",
            "type": 6, // Datepicker
            "style": 1,
            "required": false,
            "mode": "range",
            "defaultValue": null
        },
        {
            "sectionId": "location_map",
            "title": "موقعیت مکانی:",
            "description": "موقعیت دقیق پروژه روی نقشه",
            "type": 10, // map visible
            "style": 1,
            "required": false,
            "height": 300,
            "scrollEnabled": true,
            "zoomEnabled": true,
            "markerTitle": "موقعیت پروژه",
            "markerDescription": "محل اجرای پروژه",
            "defaultValue": {
                "latitude": 35.6892,
                "longitude": 51.3890
            }
        },
        {
            "sectionId": "payment_1",
            "title": "پرداخت اول:",
            "type": 4, // select
            "style": 5, // payment
            "removable": true,
            "fields": [
                {
                    "fieldId": "percent",
                    "title": "درصدپرداخت",
                    "placeholder": "20%",
                    "type": 4,
                    "style": 1, // normal select
                    "required": true,
                    "options": [
                        "10%","20%","30%","40%","50%","60%","70%","80%","90%","100%"
                    ],
                    "defaultValue": "20%"
                },
                {
                    "fieldId": "grace_period",
                    "title": "مهلت پرداخت",
                    "placeholder": "بیش پرداخت",
                    "type": 4,
                    "style": 1, // normal select
                    "required": true,
                    "options": ["بیش پرداخت","۷ روز","۱۵ روز","۳۰ روز","۶۰ روز","۹۰ روز"],
                    "defaultValue": "بیش پرداخت"
                },
                {
                    "fieldId": "on_receipt",
                    "title": "در صدور پرداخت",
                    "placeholder": "وارد کنید...",
                    "type": 5, // checkbox
                    "style": 1, // normal checkbox
                    "color": "yellow",
                    "defaultValue": false
                }
            ]
        },
        {
            "sectionId": "crane_selection",
            "title": "انتخاب جرثقیل:",
            "placeholder": "نوع جرثقیل خود را انتخاب کنید.",
            "type": 4, // select
            "style": 2, // multiselect
            "required": false,
            "options": ["جرثقیل ۲۰ تنی","جرثقیل ۳۰ تنی","جرثقیل ۵۰ تنی","جرثقیل ۷۰ تنی","جرثقیل ۱۰۰ تنی"],
            "defaultValue": [],
            "maxVisibleItems": 3
        },
        {
            "sectionId": "description",
            "title": "توضیحات:",
            "placeholder": "توضیحات خود را ثبت کنید.",
            "type": 1, // input
            "style": 3,
            "required": false,
            "maxLength": 250,
            "minHeight": 80,
            "numberOfLines": 4,
            "defaultValue": ""
        },
        {
            "sectionId": "specialist_selection",
            "title": "انتخاب جرثقیل توسط متخصص:",
            "type": 5, // checkbox
            "style": 4, // switch btn
            "required": false,
            "defaultValue": false
        },
        {
            "sectionId": "crane_rating",
            "title": "جرثقیل‌ها:",
            "type": 4, // select
            "style": 4, // stars
            "required": false,
            "maxStars": 5,
            "defaultValue": 0
        },
        {
            "sectionId": "cancellation_reason",
            "title": "دلیل لغو درخواست:",
            "type": 4, // select
            "style": 6, // btnselect
            "required": false,
            "color" : "blue",
            "isMulti": true,
            "options": ["تاخیر در زمان حضور", "خرابی یا نقص فنی","رفتار نامناسب","عدم رعایت اصول ایمنی","اختلاف در مبلغ یا نحوهی پرداخت","عدم تطابق نوع جرثقیل","مشکلات مربوط به بیمه","آسیب به بار","تاخیر در شروع یا پایان کار","سایر"
            ],
            "defaultValue": null
        }
    ];
