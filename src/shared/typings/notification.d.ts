interface AppNotification {
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  action_url?: string;
  created_at: Date;
  metadata: Record<string, unknown>;
  read_at?: Date;
  sent_at?: Date;
  icon?: string;
  id: string;
  updated_at: Date;
  deleted_at: Date;
}
