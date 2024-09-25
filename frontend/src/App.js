import React, { useState } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	NavLink,
	Navigate,
} from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import "./App.css";
import Dashboard from "./Components/Dashboard";
import UserDashboard from "./Pages/UserDashboard";
import SummaryExamples from "./Components/SummaryExamples";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons'
library.add(faLocationCrosshairs)
function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false); // Set to false initially for actual use
	const [courseId,setCourseId]=useState(0);
	return (
		<Router>
			<div className="app">
				{!isLoggedIn ? (
					<div className="auth-card">
						<div className="auth-nav">
							<NavLink
								to="/"
								className={({ isActive }) =>
									isActive ? "active" : ""
								}
							>
								Sign In
							</NavLink>
							<NavLink
								to="/signup"
								className={({ isActive }) =>
									isActive ? "active" : ""
								}
							>
								Sign Up
							</NavLink>
						</div>
						<Routes>
							<Route
								path="/"
								element={
									<Login setIsLoggedIn={setIsLoggedIn} />
								}
							/>
							<Route
								path="/signup"
								element={
									<Signup setIsLoggedIn={setIsLoggedIn} />
								}
							/>

							<Route path="*" element={<Navigate to="/" />} />
						</Routes>
					</div>
				) : (
					<Routes>
						<Route path="/" element={<Navigate to="/dashboard"/>}/>
						<Route path="/course" element={<Dashboard setIsLoggedIn={setIsLoggedIn} courseId={courseId} setCourseId={setCourseId}/>}/>
						<Route path="/dashboard" element={<UserDashboard setCourseId={setCourseId}/>}/>
						<Route path="/summary-examples" element={<SummaryExamples />} />
					</Routes>
					
				)}
			</div>
			
		</Router>
	);
}

export default App;
