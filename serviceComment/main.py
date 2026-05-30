import re
import requests
from dataclasses import dataclass
from flask import Flask, jsonify, abort, request, redirect
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import UniqueConstraint, PrimaryKeyConstraint

if __name__ == '__main__':
    from mq_producer import publish


def db_info(yaml, keys):
    with open(yaml) as f:
        content = f.read()
        result = dict(re.findall("(" + '|'.join(keys) + ")" + ": ([^\s]+)", content))
        len_tab = len(re.findall("\n(.*)" + keys[0], content)[0]) // 3
        tab = " " * len_tab
        result['SERVICE'] = re.findall("\n" + tab + "(.*):\n(?:" + tab * 2 + ".*\n){0,10}      " + keys[0], content)[0]
        return result


login_info = db_info('docker-compose.yaml',
                     ['MYSQL_DATABASE', 'MYSQL_USER', 'MYSQL_PASSWORD'])

app = Flask(__name__)
# app.config["SQLALCHEMY_DATABASE_URI"] = 'mysql://cocomain:123456@db/mydbmain'\
# %(login_info['MYSQL_USER'],login_info['MYSQL_PASSWORD'],login_info['SERVICE'],login_info['MYSQL_DATABASE'])

app.config["SQLALCHEMY_DATABASE_URI"] = 'mysql://%s:%s@%s/%s' % (
    login_info['MYSQL_USER'], login_info['MYSQL_PASSWORD'], login_info['SERVICE'], login_info['MYSQL_DATABASE'])

CORS(app)
db = SQLAlchemy(app)
import inspect as i
import sys


@dataclass
class Song(db.Model):
    # all the Type Hints will be added to __annotations__, like below:
    # {'id': <class 'int'>, 'title': <class 'str'>, 'image': <class 'str'>}
    # jsonify() only considers the fields with a type hint, if we write id= instead of id:int=
    # then jsonify() will return {'title':xxx,'image':xxx}
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=False)
    url: str = db.Column(db.String(200))
    album: str = db.Column(db.String(100))
    soundcloud_song_id: int = db.Column(db.Integer, nullable=True)
    song_name: str = db.Column(db.String(100))
    artist: str = db.Column(db.String(100))
    # 'likes' can be calculated in the comment_database


# if use @dataclass decorator, then no need to define 'todict'
class SongUserRelation(db.Model):
    user_account = db.Column(db.String(50), primary_key=True)
    song_id = db.Column(db.Integer, primary_key=True)

    # UniqueConstraint(user_id, song_id, name='user_song_unique') # for non-PKs

    def todict(self):
        return {field.name: getattr(self, field.name) for field in self.__table__.columns}

@app.route('/')
def hello():
    return redirect("/api/songs/", code=302)

@app.route('/api/songs/')
def songs():
    return jsonify(Song.query.all())


@app.route('/api/users/')
def users():
    su = [su.todict() for su in SongUserRelation.query.all()]
    return jsonify(su)


@app.route('/api/user_likes/', methods=['GET'])
def likes_of_logged_in_user():
    req = requests.get('http://host.docker.internal:8001/api/token_logged_in_user/',
                       headers={'cookie': "login_token=" + str(request.cookies.get('login_token'))})
    data = req.json()
    su = [su.todict()['song_id'] for su in SongUserRelation.query.filter_by(user_account=data.get('account'))]
    return jsonify({'result': su})


@app.route('/api/songs/<int:id>/like/', methods=['POST'])
def like(id):
    req = requests.get('http://host.docker.internal:8001/api/token_logged_in_user/',
                       headers={'cookie': "login_token=" + str(request.cookies.get('login_token'))})
    data = req.json()
    if not data.get('account'):
        abort(401, "Please login first to like")
    song_user = SongUserRelation.query.filter_by(user_account=data.get('account'), song_id=id).first()
    if not song_user:
        if Song.query.get(id):
            song_user = SongUserRelation(user_account=data.get('account'), song_id=id)
            try:
                publish('like', id)
                db.session.add(song_user)
                db.session.commit()
                return jsonify({'response': 'you liked the song'})
            except:
                abort(500, "All rabbitmq nodes are down.")
        else:
            abort(500, "Song does not exist.")
    else:  # case: already liked this song ==> then unlike
        db.session.delete(song_user)
        publish('unlike', id)

        db.session.commit()
        return jsonify({'response': 'you unliked the song'})


if __name__ == '__main__':
    # app.run(debug=False, host='127.0.0.1')
    app.run(debug=True, use_reloader=True, host='0.0.0.0')
