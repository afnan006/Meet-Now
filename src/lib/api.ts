const API_URL = 'http://localhost:5000';

export async function createMeeting() {
  const response = await fetch(`${API_URL}/create-meeting`, {
    method: 'POST'
  });
  return response.json();
}

export async function validateMeeting(meetingId: string) {
  const response = await fetch(`${API_URL}/validate-meeting/${meetingId}`);
  return response.json();
}

export async function getParticipants(meetingId: string) {
  const response = await fetch(`${API_URL}/participants/${meetingId}`);
  return response.json();
}