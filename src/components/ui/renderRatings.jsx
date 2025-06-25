import { Star } from "lucide-react";
import { StarHalf } from "lucide-react";

export default function RenderRatings({ rating }) {
	const stars = [];
	const fullStars = Math.floor(rating);
	const hasHalfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.75;

	for (let i = 0; i < 5; i++) {
		if (i < fullStars) {
			stars.push(<Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />);
		} else if (i === fullStars && hasHalfStar) {
			stars.push(<StarHalf key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />);
		} else {
			stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
		}
	}
	return stars;
};
