import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messagesApi } from "@/lib/api";
import { useContactMessages } from "@/hooks/usePortfolioData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Trash2, MessageSquare, Mail, Clock, Check, Reply, Send, X, Bell, BellOff } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";

// Message Card Component
const MessageCard = ({ message, onReply, onDelete, onMarkRead }: any) => {
  return (
    <div
      className={`bg-card border rounded-xl p-6 transition-all hover:shadow-lg ${
        message.is_read ? "border-border" : "border-primary/50 bg-primary/5 shadow-md"
      }`}
    >
      <div className="flex items-start justify-between">
        <div 
          className="flex items-start gap-4 flex-1 cursor-pointer"
          onClick={() => !message.is_read && onMarkRead(message.id)}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.is_read ? "bg-secondary" : "bg-primary/20 ring-2 ring-primary/30"
            }`}
          >
            <Mail className={`w-5 h-5 ${message.is_read ? "text-muted-foreground" : "text-primary"}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{message.name}</h3>
              {!message.is_read && (
                <span className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs px-2.5 py-1 rounded-full font-semibold animate-pulse">
                  NEW
                </span>
              )}
            </div>
            <a
              href={`mailto:${message.email}`}
              className="text-sm text-primary hover:underline font-medium flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <Mail className="w-3 h-3" />
              {message.email}
            </a>
            <div className="bg-secondary/30 rounded-lg p-3 mt-3">
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">{message.message}</p>
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {message.created_at && formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 ml-4">
          {message.is_read && (
            <div className="text-green-500 bg-green-500/10 rounded-full w-8 h-8 flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
          )}
          <Button
            variant="default"
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={(e) => {
              e.stopPropagation();
              onReply(message);
            }}
          >
            <Reply className="w-4 h-4 mr-1" />
            Reply
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-red-400 text-red-400 hover:bg-red-500/10 hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(message.id);
            }}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

const AdminMessages = () => {
  const { data: messages, isLoading } = useContactMessages();
  const queryClient = useQueryClient();
  const [replyDialog, setReplyDialog] = useState<{ open: boolean; message: any | null }>({
    open: false,
    message: null,
  });
  const [replyForm, setReplyForm] = useState({
    subject: "",
    message: "",
  });
  const [previousUnreadCount, setPreviousUnreadCount] = useState(0);

  const unreadCount = messages?.filter((m: any) => !m.is_read).length || 0;

  // Notification for new messages
  useEffect(() => {
    if (messages && previousUnreadCount > 0 && unreadCount > previousUnreadCount) {
      const newMessageCount = unreadCount - previousUnreadCount;
      toast.success(
        `${newMessageCount} new message${newMessageCount > 1 ? 's' : ''} received!`,
        {
          duration: 5000,
          icon: '✉️',
        }
      );
    }
    if (messages) {
      setPreviousUnreadCount(unreadCount);
    }
  }, [unreadCount]);

  const markReadMutation = useMutation({
    mutationFn: (id: string | number) => messagesApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact_messages"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => messagesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact_messages"] });
      toast.success("Message deleted!");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const replyMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: any }) =>
      messagesApi.reply(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact_messages"] });
      setReplyDialog({ open: false, message: null });
      setReplyForm({ subject: "", message: "" });
      toast.success("Reply sent successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to send reply: ${error.message}`);
    },
  });

  const handleReplyClick = (message: any) => {
    setReplyDialog({ open: true, message });
    setReplyForm({
      subject: `Re: Your message`,
      message: "",
    });
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyDialog.message && replyForm.message.trim()) {
      replyMutation.mutate({
        id: replyDialog.message.id,
        data: replyForm,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  const unreadMessages = messages?.filter((m: any) => !m.is_read) || [];
  const readMessages = messages?.filter((m: any) => m.is_read) || [];
  const totalCount = messages?.length || 0;

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              Contact Messages
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage and respond to visitor messages
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Messages</p>
                <p className="text-3xl font-bold text-blue-600">{totalCount}</p>
              </div>
              <Mail className="w-10 h-10 text-blue-500/40" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Unread</p>
                <p className="text-3xl font-bold text-red-600">{unreadCount}</p>
              </div>
              <Bell className="w-10 h-10 text-red-500/40" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Replied</p>
                <p className="text-3xl font-bold text-green-600">{readMessages.length}</p>
              </div>
              <Check className="w-10 h-10 text-green-500/40" />
            </div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-6">
        {/* Unread Messages Section */}
        {unreadMessages.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-semibold">Unread Messages ({unreadMessages.length})</h2>
            </div>
            <div className="space-y-4">
              {unreadMessages.map((message: any) => (
                <MessageCard 
                  key={message.id} 
                  message={message}
                  onReply={handleReplyClick}
                  onDelete={(id) => {
                    if (confirm('Are you sure you want to delete this message?')) {
                      deleteMutation.mutate(id);
                    }
                  }}
                  onMarkRead={(id) => markReadMutation.mutate(id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Read Messages Section */}
        {readMessages.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4 mt-8">
              <Check className="w-5 h-5 text-green-500" />
              <h2 className="text-lg font-semibold text-muted-foreground">Read Messages ({readMessages.length})</h2>
            </div>
            <div className="space-y-4 opacity-75">
              {readMessages.map((message: any) => (
                <MessageCard 
                  key={message.id} 
                  message={message}
                  onReply={handleReplyClick}
                  onDelete={(id) => {
                    if (confirm('Are you sure you want to delete this message?')) {
                      deleteMutation.mutate(id);
                    }
                  }}
                  onMarkRead={(id) => markReadMutation.mutate(id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {messages?.length === 0 && (
          <div className="text-center py-16 bg-secondary/20 rounded-2xl border-2 border-dashed border-border">
            <div className="bg-gradient-to-br from-primary/20 to-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Messages Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Messages from your contact form will appear here. You'll be notified via email when new messages arrive.
            </p>
          </div>
        )}
      </div>

      {/* Reply Dialog */}
      <Dialog open={replyDialog.open} onOpenChange={(open) => {
        setReplyDialog({ open, message: null });
        setReplyForm({ subject: "", message: "" });
      }}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Reply className="w-5 h-5 text-blue-500" />
              Reply to Message
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2 text-base">
              <Mail className="w-4 h-4" />
              Sending to: <span className="font-semibold text-foreground">{replyDialog.message?.name}</span>
              <span className="text-muted-foreground">({replyDialog.message?.email})</span>
            </DialogDescription>
          </DialogHeader>

          {replyDialog.message && (
            <div className="space-y-5 mt-4">
              {/* Original Message */}
              <div className="bg-gradient-to-br from-secondary/50 to-secondary/30 p-5 rounded-xl border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <p className="text-sm font-semibold text-primary">Original Message from {replyDialog.message.name}:</p>
                </div>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed bg-background/50 p-3 rounded-lg">
                  {replyDialog.message.message}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {replyDialog.message.created_at && formatDistanceToNow(new Date(replyDialog.message.created_at), { addSuffix: true })}
                </p>
              </div>

              {/* Reply Form */}
              <form onSubmit={handleReplySubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <span className="text-primary">✉️</span> Email Subject
                  </label>
                  <Input
                    placeholder="Re: Your message"
                    value={replyForm.subject}
                    onChange={(e) =>
                      setReplyForm({ ...replyForm, subject: e.target.value })
                    }
                    required
                    className="bg-secondary/50 border-border focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <span className="text-primary">✍️</span> Your Reply <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    placeholder="Type your professional reply here...\n\nYour message will be sent from: zfahmid54@gmail.com"
                    value={replyForm.message}
                    onChange={(e) =>
                      setReplyForm({ ...replyForm, message: e.target.value })
                    }
                    required
                    rows={10}
                    className="resize-none bg-secondary/50 border-border focus:ring-2 focus:ring-primary/50 font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">Tip: Be professional and courteous in your response</p>
                </div>

                <div className="flex justify-between items-center gap-3 pt-4 border-t">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Email will be sent from your Gmail account
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setReplyDialog({ open: false, message: null });
                        setReplyForm({ subject: "", message: "" });
                      }}
                      disabled={replyMutation.isPending}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={replyMutation.isPending || !replyForm.message.trim()}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 min-w-[140px]"
                    >
                      {replyMutation.isPending ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Reply
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMessages;