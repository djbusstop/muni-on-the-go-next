import { notFound } from "next/navigation";
import fetchVehicleMonitoring, {
  getStops,
  getVehicleJourney,
} from "./fetchVehicleMonitoring";
import OnwardCallList from "./components/OnwardCallList";
import DataAttribution from "@/ui/DataAttribution";

export default async function Page({
  params,
}: {
  params: Promise<{ vehicleId: string }>;
}) {
  const vehicleIdSlug = (await params).vehicleId;

  // Parse vehicle ID to number
  const vehicleId = parseInt(vehicleIdSlug);
  if (isNaN(vehicleId)) notFound();

  const vehicleMonitoringResponse = await fetchVehicleMonitoring(vehicleId);
  const vehicleJourney = getVehicleJourney(vehicleMonitoringResponse);

  if (!vehicleJourney) notFound();

  const stops = getStops(vehicleJourney);

  return (
    <main>
      <h1 className="text-3xl leading-loose font-bold">
        Vehicle #{vehicleJourney.VehicleRef}
      </h1>
      {vehicleJourney?.LineRef && vehicleJourney?.DestinationName && (
        <h3 className="text-xl font-bold">
          {vehicleJourney.LineRef} {vehicleJourney.PublishedLineName} to{" "}
          {vehicleJourney.DestinationName}
        </h3>
      )}

      <div className="mt-6">
        {stops.length ? (
          <OnwardCallList onwardCalls={stops} />
        ) : (
          <h2 className="text-xl">
            Tracking is not available. Please refresh to try again
          </h2>
        )}
      </div>
      <DataAttribution />
    </main>
  );
}
