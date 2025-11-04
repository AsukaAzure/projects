import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Notification as NotificationType } from './mock';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, MessageSquare, ThumbsUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id: string) => {
    const stored = localStorage.getItem("user");
    const user = stored ? JSON.parse(stored) : null;
    const token = user?.token;
    try {
      const res = await fetch(`/api/notification/${id}/read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error("mark read failed", err);
    }
  };

  const markAllAsRead = async () => {
    const stored = localStorage.getItem("user");
    const user = stored ? JSON.parse(stored) : null;
    const token = user?.token;
    try {
      const res = await fetch(`/api/notification/markAllRead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("mark all read failed", err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'answer':
        return <MessageSquare className="h-5 w-5 text-primary" />;
      case 'vote':
        return <ThumbsUp className="h-5 w-5 text-primary" />;
      default:
        return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      const stored = localStorage.getItem("user");
      const user = stored ? JSON.parse(stored) : null;
      const token = user?.token;
      try {
        const res = await fetch("/api/notification", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load notifications");
        // normalize dates coming from server
        const notes = (data.notifications || []).map((n: any) => ({
          id: n._id || n.id,
          type: n.type,
          message: n.message,
          questionId: n.question ? (n.question._id || n.question) : n.questionId,
          questionTitle: n.questionTitle || n.question?.title || "",
          triggeredBy: n.triggeredBy?.username || n.triggeredBy,
          read: !!n.read,
          createdAt: n.createdAt ? new Date(n.createdAt) : new Date(),
        }));
        setNotifications(notes);
      } catch (err: any) {
        setError(err.message || "Unable to load");
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with answers and activity on your questions
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            <Check className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      {unreadCount > 0 && (
        <div className="mb-4">
          <Badge variant="secondary">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </Badge>
        </div>
      )}

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
            <p className="text-muted-foreground">
              You'll see notifications here when people answer your questions
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card 
              key={notification.id}
              className={`cursor-pointer transition-colors hover:bg-accent/50 ${
                !notification.read ? 'border-primary/50 bg-primary/5' : ''
              }`}
              onClick={() => {
                markAsRead(notification.id);
                navigate(`/question/${notification.questionId}`);
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        {notification.message}
                        {!notification.read && (
                          <Badge variant="default" className="text-xs">New</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {notification.questionTitle}
                      </CardDescription>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  {!notification.read && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
