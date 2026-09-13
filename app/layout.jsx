import './globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { EventProvider } from '../context/EventContext';

export const metadata = {
  title: "The Chase Club — Delhi's Running & Fitness Crew",
  description: "Weekly paced runs, track intervals, race-day support, and morning community coffee across Delhi."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="logo">
      <body>
        <ThemeProvider>
          <AuthProvider>
            <EventProvider>
              {children}
            </EventProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
