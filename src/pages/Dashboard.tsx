// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '../components/Button';
// import { useAuthStore } from '../lib/store';
// import { Video, Copy, LogOut } from 'lucide-react';
// import { createMeeting } from '../lib/api';
// import { formatDate } from '../lib/utils';
// import { auth } from '../lib/firebase';

// interface Meeting {
//   id: string;
//   timestamp: Date;
// }



// export function Dashboard() {
//   const [meetings, setMeetings] = useState<Meeting[]>([]);
//   const navigate = useNavigate();
//   const user = useAuthStore((state) => state.user);
//   const setUser = useAuthStore((state) => state.setUser);

//   useEffect(() => {
//     const storedMeetings = localStorage.getItem('meetings');
//     if (storedMeetings) {
//       setMeetings(JSON.parse(storedMeetings).map((m: any) => ({
//         ...m,
//         timestamp: new Date(m.timestamp)
//       })));
//     }
//   }, []);

//   const handleCreateMeeting = async () => {
//     try {
//       const { meeting_id, timestamp } = await createMeeting();
//       const newMeeting = { id: meeting_id, timestamp: new Date(timestamp) };
//       const updatedMeetings = [newMeeting, ...meetings];
//       setMeetings(updatedMeetings);
//       localStorage.setItem('meetings', JSON.stringify(updatedMeetings));
//       navigate(`/meeting/${meeting_id}`);
//     } catch (error) {
//       console.error('Error creating meeting:', error);
//     }
//   };

//   const copyMeetingLink = (meetingId: string) => {
//     const link = `${window.location.origin}/meeting/${meetingId}`;
//     navigator.clipboard.writeText(link);
//   };

//   const handleSignOut = async () => {
//     await auth.signOut();
//     setUser(null);
//     navigate('/auth');
//   };

//   return (
//     <div className="min-h-screen bg-stone-50 p-4">
//       <div className="max-w-4xl mx-auto space-y-8">
//         <header className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Video className="h-8 w-8 text-rose-500" />
//             <h1 className="text-2xl font-bold text-stone-900">Meet Now</h1>
//           </div>
//           <div className="flex items-center gap-4">
//             <span className="text-stone-600">{user?.email}</span>
//             <Button variant="outline" onClick={handleSignOut}>
//               <LogOut className="h-5 w-5" />
//             </Button>
//           </div>
//         </header>

//         <div className="space-y-6">
//           <Button onClick={handleCreateMeeting} className="w-full sm:w-auto">
//             Create New Meeting
//           </Button>

//           {meetings.length > 0 && (
//             <div className="bg-white rounded-lg shadow-sm">
//               <div className="p-4 border-b border-stone-200">
//                 <h2 className="text-lg font-semibold text-stone-900">Past Meetings</h2>
//               </div>
//               <div className="divide-y divide-stone-200">
//                 {meetings.map((meeting) => (
//                   <div key={meeting.id} className="p-4 flex items-center justify-between">
//                     <div>
//                       <p className="font-medium text-stone-900">Meeting {meeting.id.slice(0, 8)}</p>
//                       <p className="text-sm text-stone-600">{formatDate(meeting.timestamp)}</p>
//                     </div>
//                     <div className="flex gap-2">
//                       <Button
//                         variant="outline"
//                         onClick={() => copyMeetingLink(meeting.id)}
//                       >
//                         <Copy className="h-4 w-4" />
//                       </Button>
//                       <Button
//                         onClick={() => navigate(`/meeting/${meeting.id}`)}
//                       >
//                         Join
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { useAuthStore } from '../lib/store';
import { Video, Copy, LogOut } from 'lucide-react';
import { createMeeting } from '../lib/api';
import { formatDate } from '../lib/utils';
import { auth } from '../lib/firebase';

interface Meeting {
  id: string;
  timestamp: Date;
}

export function Dashboard() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [meetingLink, setMeetingLink] = useState('');
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const storedMeetings = localStorage.getItem('meetings');
    if (storedMeetings) {
      setMeetings(JSON.parse(storedMeetings).map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp)
      })));
    }
  }, []);

  const handleCreateMeeting = async () => {
    try {
      const { meeting_id, timestamp } = await createMeeting();
      const newMeeting = { id: meeting_id, timestamp: new Date(timestamp) };
      const updatedMeetings = [newMeeting, ...meetings];
      setMeetings(updatedMeetings);
      localStorage.setItem('meetings', JSON.stringify(updatedMeetings));
      const link = `${window.location.origin}/meeting/${meeting_id}`;
      setMeetingLink(link);
    } catch (error) {
      console.error('Error creating meeting:', error);
    }
  };

  const copyMeetingLink = (meetingId: string) => {
    const link = `${window.location.origin}/meeting/${meetingId}`;
    navigator.clipboard.writeText(link);
  };

  const handleSignOut = async () => {
    await auth.signOut();
    setUser(null);
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-stone-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="h-8 w-8 text-rose-500" />
            <h1 className="text-2xl font-bold text-stone-900">Meet Now</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-stone-600">{user?.email}</span>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <div className="space-y-6">
          <Button onClick={handleCreateMeeting} className="w-full sm:w-auto">
            Create New Meeting
          </Button>

          {meetingLink && (
            <div className="mb-4">
              <p>Share this link with participants:</p>
              <a href={meetingLink} target="_blank" rel="noopener noreferrer">
                {meetingLink}
              </a>
              <Button
                onClick={() => navigator.clipboard.writeText(meetingLink)}
                className="ml-2"
              >
                <Copy className="h-5 w-5" />
                Copy Link
              </Button>
            </div>
          )}

          {meetings.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-stone-200">
                <h2 className="text-lg font-semibold text-stone-900">Past Meetings</h2>
              </div>
              <div className="divide-y divide-stone-200">
                {meetings.map((meeting) => (
                  <div key={meeting.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-stone-900">Meeting {meeting.id.slice(0, 8)}</p>
                      <p className="text-sm text-stone-600">{formatDate(meeting.timestamp)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => copyMeetingLink(meeting.id)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => navigate(`/meeting/${meeting.id}`)}
                      >
                        Join
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;