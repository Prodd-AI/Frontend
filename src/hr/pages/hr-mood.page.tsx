import PageHeader from "@/shared/components/page-header.component";
import MoodHeatmap from "@/hr/components/mood-heatmap.component";

function HrMoodPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        dataTour="page-header"
        title="Mood Heatmap"
        subtitle="Visualize team mood distribution over time"
      />
      <div className="rounded-3xl bg-white p-5 border border-gray-200">
        <MoodHeatmap />
      </div>
    </div>
  );
}

export default HrMoodPage;
