case $1 in
Backend)
  while ! curl --http0.9 -o - "database:3306" &>/dev/null; do
    echo "############ $1 deployment waiting for database initialization"
    sleep 1
  done
  echo "############ $1 deployment starts"
  python flask_manage.py dbm init
  python flask_manage.py dbm migrate
  python flask_manage.py dbm upgrade
  ;;
RabbitMQ)
  while ! (curl "backend:5000" | grep 'redirect' ) &>/dev/null; do
    echo "############ $1 deployment waiting for Backend initialization"
    sleep 1
  done
  echo "############ $1 deployment starts"
  ;;
*) ;;
esac

