import { useCallback, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ScheduleMeeting, {
  type ScheduleMeetingDefaultValues,
} from "@/shared/components/schedule-meeting.component";
import { getTeamMembers } from "@/config/services/teams.service";
import type { FlightRiskInfo } from "@/hr/typings/flight-risk-card";
import {
  HrScheduleMeetingContext,
  type HrScheduleMeetingContextValue,
} from "@/hr/hooks/use-hr-schedule-meeting";

/**
 * Wraps the HR routes. Hosts the Schedule Meeting dialog state so any HR page
 * (overview, flight risk, top-bar action) can trigger it via `useHrScheduleMeeting`.
 */
export default function HrScheduleMeetingProvider() {
  const [isOpen, setIsOpen] = useState(false);
  const [prefill, setPrefill] = useState<FlightRiskInfo | null>(null);

  const open = useCallback((person?: FlightRiskInfo | null) => {
    setPrefill(person ?? null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setPrefill(null);
  }, []);

  const { data: prefillMembers } = useQuery({
    queryKey: ["schedule-prefill-members", prefill?.team_id, prefill?.id],
    queryFn: () => getTeamMembers(prefill!.team_id!),
    enabled: !!prefill?.team_id && !!prefill?.id && !prefill?.email,
  });

  const resolvedEmail =
    prefill?.email ??
    prefillMembers?.data?.find(
      (m: { id: string; email?: string }) => m.id === prefill?.id,
    )?.email;

  const defaultValues: ScheduleMeetingDefaultValues | undefined = prefill
    ? {
        title: `1:1 with ${prefill.member_name}`,
        type: "1:1",
        description:
          "Check-in and wellbeing conversation. Discuss workload, blockers, and support needed.",
        attendee_emails: resolvedEmail ? [resolvedEmail] : [],
        defaultTeamId: prefill.team_id,
      }
    : undefined;

  const value = useMemo<HrScheduleMeetingContextValue>(
    () => ({ open, close }),
    [open, close],
  );

  return (
    <HrScheduleMeetingContext.Provider value={value}>
      <Outlet />
      <Dialog
        open={isOpen}
        onOpenChange={(o) => (o ? setIsOpen(true) : close())}
      >
        <DialogContent className="!min-w-[40rem] p-8 rounded-2xl border-gray-200/80 shadow-xl">
          <ScheduleMeeting
            defaultValues={defaultValues}
            onCancel={close}
            onSchedule={close}
          />
        </DialogContent>
      </Dialog>
    </HrScheduleMeetingContext.Provider>
  );
}
