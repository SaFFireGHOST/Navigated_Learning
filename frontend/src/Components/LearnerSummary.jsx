import React, { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { getResponsePost,getResponseGet } from "../lib/utils";
import Spinner from 'react-bootstrap/Spinner';
import { pdfjs } from 'react-pdf';
import Tooltip from '@mui/material/Tooltip';

// Update workerSrc to use the local worker script
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.mjs',
	import.meta.url,
).toString();


const XButton = ({ onClick }) => {
	const [clicked, setClicked] = useState(false);

	const handleClick = () => {
		setClicked(true);
		if (onClick) {
			onClick();
		}
	};

	return (
		<button
			className={`button-close ${clicked ? 'clicked' : ''}`}
			onClick={handleClick}
			aria-label="Close"
		>
		</button>
	);
}


const LearnerSummary = ({ activitiesState, learnerPosState, showSummary, setShowSummary, setOpen, setPrevPos,enrollId,setSummary,summary,learnerId,setEnrolledLearner,courseId }) => {
	const [pdfFile, setPdfFile] = useState(null);
	const [loading, setLoading] = useState(false);
	// const [summary, setSummary] = useState("");


	function handleClose() {
		setShowSummary(false);
	}

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		if (file && file.type === 'application/pdf') {
			setPdfFile(file);
			extractTextFromPDF(file);
		} else {
			alert('Please upload a valid PDF file');
		}
	};


	const extractTextFromPDF = async (file) => {
		const fileReader = new FileReader();
		fileReader.onload = async () => {
			const typedArray = new Uint8Array(fileReader.result);
			const pdf = await pdfjs.getDocument({ data: typedArray }).promise;
			let text = '';
			for (let i = 1; i <= pdf.numPages; i++) {
				const page = await pdf.getPage(i);
				const content = await page.getTextContent();
				text += content.items.map(item => item.str).join(' ');
			}
			setSummary(text);
		};
		fileReader.readAsArrayBuffer(file);
	};

	const updatePosition = async () => {
		let data = {
			summary: summary,
			enroll_id: enrollId,
			course_id: 1,
		};
		setLoading(true);
		const response = await getResponsePost("/submitsummary", data);
		console.log(response);
		var newPositions = response?.data;
		if (!newPositions) {
			console.log(newPositions, "this the not the expected response");
			return;
		}
		console.log(newPositions);
		setPrevPos(learnerPosState[0]);
		learnerPosState[1]([newPositions[0], newPositions[1]]);
		console.log("this is the new position", newPositions);

		const response2 = await getResponseGet(`enrolledLearner/${learnerId}/${courseId}`);// add course id afterwards
		if (response2?.data) {
			
			setEnrolledLearner(response2.data);
			// console.log("Enrolled Learner", enrolledLearner);
			// Update learner position state with the new coordinates if they exist
			if (response2.data.x_coordinate && response2.data.y_coordinate) {
				learnerPosState[1]([
					Number(response2.data.x_coordinate),
					Number(response2.data.y_coordinate)
				]);
			}
		} else {
			console.error("Failed to fetch enrolled learner data", response2);
		}


		setSummary(summary);
		activitiesState[1]((activities) => [
			...activities,
			{
				type: "summary",
				name: summary,
				time: Date(),
			},
		]);
		const activityData = {
			type: "summary",
			name: summary.slice(0,50),
			time: new Date().toISOString().slice(0, 19).replace('T', ' '),
			link:null,
			enroll_id:enrollId,
		}
		const response1 = await getResponsePost("/activities", activityData);
		console.log(response1);
		const responseData = response1?.data;

		setLoading(false);
		setSummary("");
		setShowSummary(false);
		setOpen(true);
	};

	return (
		<>
			{showSummary && <div className="learnerSummaryBody" >
				{loading ?
					<>
						<div className="center">
							<Spinner animation="border" style={{ color: "blueviolet" }} />
							<p style={{ marginTop: "13px" }}>Please wait while we update your position</p>

						</div>


					</>
					:
					<>
						<InputGroup className="mb-3 titleText">
							<InputGroup.Text>Title</InputGroup.Text>
							<Form.Control as="textarea" aria-label="With textarea" placeholder="Enter the title" />
						</InputGroup>
						<InputGroup className="mb-3 summaryText">
							<InputGroup.Text>Summary</InputGroup.Text>
							<Form.Control
								as="textarea"
								placeholder="Enter the summary or upload a pdf"
								aria-label="With textarea"
								value={summary}
								minLength={500}
								maxLength={1000}
								onChange={(e) => setSummary(e.target.value)}
							/>
						</InputGroup>

						{/* <InputGroup className="mb-3 pdfUpload">
      			<Form.Control
        			type="file"
        			accept="application/pdf"
        			onChange={handleFileChange}
      			/>
      			<InputGroup.Text id="basic-addon2">Upload your PDF</InputGroup.Text>
    		</InputGroup> */}

						<Button

							// variant="danger"
							className="summarySubmitButton"
							onClick={updatePosition}
							disabled={loading}
						>
							Update My Position
						</Button>
					</>
				}


			</div>}
		</>


	);
};

export default LearnerSummary;
