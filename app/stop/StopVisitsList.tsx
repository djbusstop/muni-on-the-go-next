import clsx from "clsx";
import ListItemLink from "@/ui/ListItemLink";
import RouteDisplay from "@/ui/RouteDisplay";
import DirectionPicker from "@/ui/DirectionPicker";
import { localDate } from "@/lib/date";
import Punctuality from "@/ui/time/Punctuality";
import WaitTime from "@/ui/time/WaitTime";

const StopVisitsList = ({
  stopVisits,
  direction,
  arrivalVehicleId,
}: {
  stopVisits: MonitoredVehicleJourney<MonitoredCall>[];
  direction?: Direction;
  arrivalVehicleId?: string;
}) => {
  // Available directions. There will be at least one stop visit in each direction.
  const directions = stopVisits.reduce((acc: Direction[], stopVisit) => {
    if (!acc.includes(stopVisit.DirectionRef))
      return [...acc, stopVisit.DirectionRef];
    return acc;
  }, []);

  const filteredStopVisits = stopVisits.filter((stopVisit) => {
    // Filter stop visits by direction
    if (direction && stopVisit.DirectionRef !== direction) return false;
    return true;
  });

  return (
    <>
      {directions.length >= 2 && (
        <div className="mb-2">
          <DirectionPicker value={direction} directions={directions} />
        </div>
      )}
      <ul className="flex flex-col list-none gap-3">
        {filteredStopVisits.map((stopVisit, index) => {
          const scheduledTime = localDate(
            stopVisit.MonitoredCall.AimedArrivalTime
          );

          const expectedTime = localDate(
            stopVisit.MonitoredCall.ExpectedArrivalTime ||
              stopVisit.MonitoredCall.ExpectedDepartureTime ||
              stopVisit.MonitoredCall.AimedArrivalTime
          );

          return (
            <ListItemLink
              key={index.toString() + stopVisit.DatedVehicleJourneyRef}
              highlight={stopVisit.VehicleRef === arrivalVehicleId}
              href={
                stopVisit.VehicleRef
                  ? `/vehicle/${stopVisit.VehicleRef}?boardingAt=${stopVisit.MonitoredCall.StopPointRef}`
                  : undefined
              }
            >
              {/* Row */}
              <div className={clsx(["flex", "items-center", "gap-2"])}>
                {/* Left col */}
                <div className="flex flex-col flex-grow">
                  <h3 className="text-md font-semibold leading-loose">
                    <RouteDisplay route={stopVisit.LineRef} />{" "}
                    {stopVisit.PublishedLineName}{" "}
                  </h3>
                  <span className="text-sm">
                    {stopVisit.DirectionRef === "IB" ? "→ " : "← "}
                    {stopVisit.DestinationName}
                  </span>
                  <span className="text-xs mt-0.5">
                    {expectedTime.format("HH:mm")}
                    {" • "}
                    <Punctuality
                      scheduled={scheduledTime.toDate()}
                      expected={expectedTime.toDate()}
                    />
                  </span>
                </div>
                {/* Right col */}
                <WaitTime
                  expectedTime={expectedTime.toDate()}
                  tracking={Boolean(stopVisit.VehicleRef)}
                />
              </div>
            </ListItemLink>
          );
        })}
      </ul>
    </>
  );
};
export default StopVisitsList;
