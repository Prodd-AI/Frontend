import PageHeader from "@/shared/components/page-header.component";
import TimesheetTabContent from "@/shared/components/timesheet/timesheet-tab-content.component";

function TimesheetPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Timesheet"
        subtitle="Track time, view the weekly overview, and log daily activity"
      />
      <TimesheetTabContent />
    </div>
  );
}

export default TimesheetPage;
