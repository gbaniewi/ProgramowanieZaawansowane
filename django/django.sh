#!/bin/bash
echo "Starting Django setup..."
echo "Running makemigrations..."
python manage.py makemigrations djangoapp
echo "Makemigrations completed."
echo "Running migrate..."
python manage.py migrate
echo "Migrate completed."
echo "Starting Django server..."
python manage.py runserver 0.0.0.0:8000
echo "Django server started."
