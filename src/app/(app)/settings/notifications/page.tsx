"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Bell, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { usePushSubscription } from "@/hooks/usePushSubscription";

export default function NotificationSettingsPage() {
  const { permission, isSubscribed, subscribe, unsubscribe } = usePushSubscription();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings/profile")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) { setPhoneNumber(data.phoneNumber || ""); setSmsEnabled(data.smsEnabled); }
      });
  }, []);

  async function saveProfile() {
    setSaving(true);
    const res = await fetch("/api/settings/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber, smsEnabled }),
    });
    if (res.ok) toast.success("Settings saved");
    setSaving(false);
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Notification Settings</h1>

      <div className="space-y-6">
        <div className="p-4 rounded-xl border bg-card space-y-3">
          <div className="flex items-center gap-2 font-medium">
            <Bell className="w-4 h-4 text-primary" /> Browser Push Notifications
          </div>
          <p className="text-sm text-muted-foreground">
            Get notified even when the tab is in the background.
            {permission === "denied" && " (Blocked in browser settings)"}
          </p>
          <Button
            variant={isSubscribed ? "outline" : "default"}
            onClick={isSubscribed ? unsubscribe : subscribe}
            disabled={permission === "denied"}
          >
            {isSubscribed ? "Disable browser notifications" : "Enable browser notifications"}
          </Button>
        </div>

        <div className="p-4 rounded-xl border bg-card space-y-4">
          <div className="flex items-center gap-2 font-medium">
            <Smartphone className="w-4 h-4 text-primary" /> SMS Notifications (Twilio)
          </div>
          <div>
            <Label>Phone Number (E.164 format, e.g. +14155552671)</Label>
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1..."
              className="mt-1"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable SMS</Label>
              <p className="text-xs text-muted-foreground">Receive SMS for reminders with SMS enabled</p>
            </div>
            <Switch checked={smsEnabled} onCheckedChange={setSmsEnabled} />
          </div>
          <Button onClick={saveProfile} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        </div>
      </div>
    </div>
  );
}
