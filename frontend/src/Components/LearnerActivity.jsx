import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PublishIcon from "@mui/icons-material/Publish";
import StarIcon from "@mui/icons-material/Star";
import Typography from "@mui/material/Typography";
import TourComponent from "./TourComponent";

const LearnerActivity = ({ activitiesState }) => {
	console.log("this is activitiesState", activitiesState[0]);

	return (
		<div className="learnerActivityBody">
			<h3 style={{ textAlign: "center" }}>My Learning Journey</h3>
			<div style={{ alignContent: "center", height: "600px" }}>

				<TourComponent />
				<Timeline position="right">
					<TimelineItem>
						<TimelineOppositeContent
							sx={{ m: "auto 0" }}
							align="right"
							variant="body2"
							color="text.secondary"
						>
							Start
						</TimelineOppositeContent>
						<TimelineSeparator>
							<TimelineDot>
								<StarIcon />
							</TimelineDot>
							<TimelineConnector />
						</TimelineSeparator>
						<TimelineContent sx={{ py: "12px", px: 2 }}>
							<Typography variant="h6" component="span">
								Beginning of Activities
							</Typography>
						</TimelineContent>
					</TimelineItem>

					{activitiesState[0].map((activity, index) => (
						<TimelineItem key={index}>
							<TimelineOppositeContent
								sx={{ m: "auto 0" }}
								align="right"
								variant="body2"
								color="text.secondary"
							>
								{(new Date(activity.time)).toLocaleString('en-IN', {
									weekday: "short",
									year: "numeric",
									month: "short",
									day: "numeric",
									hour: "2-digit",
									minute: "2-digit",
									second: "2-digit",
									timeZone: "Asia/Kolkata",
									timeZoneName: "short"
								})}
							</TimelineOppositeContent>
							<TimelineSeparator>
								<TimelineConnector />
								<TimelineDot>
									{activity.type === "resource" ? (
										<MenuBookIcon />
									) : (
										<PublishIcon />
									)}
								</TimelineDot>
								<TimelineConnector />
							</TimelineSeparator>
							<TimelineContent sx={{ py: "12px", px: 2 }}>
								<Typography variant="h6" component="span">
									{activity.name.slice(0, 50)}
								</Typography>
								<Typography>
									<a
										href={activity.link}
										target="_blank"
										rel="noopener noreferrer"
									>
										{activity.link}
									</a>
								</Typography>
							</TimelineContent>
						</TimelineItem>
					))}
				</Timeline>
			</div>

		</div>
	);
};

export default LearnerActivity;
