import { FunnelMetrics } from "@/components/metrics/funnel-metrics";
import { MetricsDashboard } from "@/components/metrics/metrics-dashboard";

export default function MetricsPage() {
	return (
		<section>
			<MetricsDashboard />

			<div className="mt-10 border-t border-border pt-10">
				<FunnelMetrics />
			</div>
		</section>
	);
}
