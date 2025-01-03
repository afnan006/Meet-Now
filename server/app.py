from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_cors import CORS
import sqlite3
import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

def init_db():
    conn = sqlite3.connect('meetings.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS meetings (
            id TEXT PRIMARY KEY,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS participants (
            id TEXT PRIMARY KEY,
            meeting_id TEXT,
            name TEXT,
            FOREIGN KEY (meeting_id) REFERENCES meetings (id)
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route('/create-meeting', methods=['POST'])
def create_meeting():
    meeting_id = str(uuid.uuid4())
    conn = sqlite3.connect('meetings.db')
    c = conn.cursor()
    c.execute('INSERT INTO meetings (id) VALUES (?)', (meeting_id,))
    conn.commit()
    conn.close()
    return jsonify({
        "meeting_id": meeting_id,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/validate-meeting/<meeting_id>', methods=['GET'])
def validate_meeting(meeting_id):
    conn = sqlite3.connect('meetings.db')
    c = conn.cursor()
    c.execute('SELECT id FROM meetings WHERE id = ?', (meeting_id,))
    meeting = c.fetchone()
    conn.close()
    
    if meeting:
        return jsonify({"status": "success"})
    return jsonify({"status": "error", "message": "Meeting not found"}), 404

@app.route('/participants/<meeting_id>', methods=['GET'])
def get_participants(meeting_id):
    conn = sqlite3.connect('meetings.db')
    c = conn.cursor()
    c.execute('SELECT id, name FROM participants WHERE meeting_id = ?', (meeting_id,))
    participants = [{"id": p[0], "name": p[1]} for p in c.fetchall()]
    conn.close()
    return jsonify({"participants": participants})

@socketio.on('join')
def on_join(data):
    room = data['meeting_id']
    join_room(room)
    emit('user_joined', {
        'user': data['user'],
        'timestamp': datetime.now().isoformat()
    }, room=room)

@socketio.on('leave')
def on_leave(data):
    room = data['meeting_id']
    leave_room(room)
    emit('user_left', {
        'user': data['user'],
        'timestamp': datetime.now().isoformat()
    }, room=room)

@socketio.on('message')
def handle_message(data):
    room = data['meeting_id']
    emit('new_message', {
        'sender': data['sender'],
        'text': data['text'],
        'timestamp': datetime.now().isoformat()
    }, room=room)

@socketio.on('signal')
def handle_signal(data):
    room = data['meeting_id']
    emit('signal', {
        'sender': data['sender'],
        'signal': data['signal']
    }, room=room, include_self=False)

if __name__ == '__main__':
    socketio.run(app, debug=True)