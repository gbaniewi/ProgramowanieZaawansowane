#!/bin/bash
python manage.py makemigrations djangoapp
python manage.py migrate
python manage.py runserver 0.0.0.0:8000