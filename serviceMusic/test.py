import csv
import requests

with open('music.csv') as csvfile:
    lines = csv.reader(csvfile, delimiter=';')
    row = next(lines)
    response = requests.post('http://host.docker.internal:8001/api/songs/',
                             data={'url': row[0], 'album': row[1], 'song_name': row[2], 'artist': row[3]})
    while response.status_code != 201:
        response = requests.post('http://host.docker.internal:8001/api/songs/',
                                 data={'url': row[0], 'album': row[1], 'song_name': row[2], 'artist': row[3]})
    print("Insert song", response.content)
    for row in lines:
        response = requests.post('http://host.docker.internal:8001/api/songs/',
                                 data={'url': row[0], 'album': row[1], 'song_name': row[2], 'artist': row[3]})
        print("Insert song", response.content)
