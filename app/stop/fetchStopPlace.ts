// API Docs: https://511.org/sites/default/files/2022-11/511%20SF%20Bay%20Open%20Data%20Specification%20-%20Transit.pdf
const STOP_PLACES_ENDPOINT = `https://api.511.org/transit/stopplaces?api_key=${process.env.NEXT_PUBLIC_TRANSIT_511_API_TOKEN}&operator_id=SF`;

const fetchStopPlace = async (
  stopCode: string | number
): Promise<StopPlacesResponse> => {
  const response = await fetch(STOP_PLACES_ENDPOINT + `&stop_id=${stopCode}`, {
    next: {
      // Cache response for 1 hour
      revalidate: 3600,
    },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const json = await response.json();
  return json;
};

export default fetchStopPlace;
