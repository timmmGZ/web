import {Song} from "../../interfaces/song";

export function like(songs: Song[], setSongs: (songs: Song[]) => void) {
    return async (id: number) => {
        const response = await fetch('/api/songs/' + id + '/like/', {
            method: 'POST', headers: {'Content-Type': 'application/json'},
        });
        if (response.status === 200
        ) {
            setSongs(songs.map((s: Song) => {
                if (s.id === id) {
                    if (s.liked === true) {
                        s.likes--;
                        s.liked = false;
                    } else {
                        s.likes++;
                        s.liked = true;
                    }
                }
                return s;
            }));
        } else if (response.status === 401) {
            window.confirm("Please login first to like")
        } else {
            window.confirm('Server error, try again later.')
        }
    }
}
