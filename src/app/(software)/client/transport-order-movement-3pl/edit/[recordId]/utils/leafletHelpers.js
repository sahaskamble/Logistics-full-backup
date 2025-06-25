
export async function geocodeLocation(locationName) {
	try {
		const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1`);
		const data = await response.json();
		if (data.length > 0) {
			return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
		}
	} catch (err) {
		console.error("Geocoding error:", err);
	}
	return null;
}
