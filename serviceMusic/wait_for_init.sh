case $1 in
Backend)
  while ! curl --http0.9 -o - "database:3306" &>/dev/null; do
    echo "############ $1 deployment waiting for database initialization"
    sleep 1
  done
  echo "############ $1 deployment starts"
  python manage.py makemigrations
  python manage.py migrate
  ;;
RabbitMQ)
  while ! curl "backend:8000" &>/dev/null; do
    echo "############ $1 deployment waiting for Backend initialization"
    sleep 1
  done
  echo "############ $1 deployment starts"
  ;;
*) ;;
esac
