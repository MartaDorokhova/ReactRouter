import { Route, Routes, Navigate } from 'react-router-dom';
import { Task } from './Task';
import { TaskList } from './TaskList';
import styles from './App.module.css';
import { Errors } from './Error';

export const App = () => {
	return (
		<div className={styles.app}>
			<Routes>
				<Route path="/" element={<TaskList />} />
				<Route
					path="/task/:id"
					element={
						<p>
							<Task />
						</p>
					}
				/>

				<Route path="/404" element={<Errors />} />
				<Route path="*" element={<Navigate to="/404" />} />
				<Route path="/task/:*" element={<Navigate to="/404" />} />
				<Route path="/task/" element={<Navigate to="/404" />} />
			</Routes>
		</div>
	);
};
