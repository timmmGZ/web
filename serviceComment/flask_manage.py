from main import app, db as d
from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager
#Instantiating the migrate instance
Migrate(app, d)

manager = Manager(app)
# add the migrate commands, map them to dbm
# Command example :python flask_manage.py dbm
manager.add_command('dbm', MigrateCommand)
if __name__ == '__main__':
    # inside Manager class, it will use sys.argv[2] of the __main__ class
    # which is 'init/migrate/upgrade...'
    # Command example :python flask_manage.py init
    manager.run()
    #manager.run end with exit() function, so code below is unreachable
