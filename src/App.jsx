import { useEffect, useState } from 'react';
import { Route, Routes, NavLink } from 'react-router-dom';
import { Task } from './Task';
import styles from './App.module.css';

// const NotFound = () => <div>Такая страница не существует</div>;

export const App = () => {
	const [toDos, setToDos] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const [refreshToDosFlag, setRefreshToDosFlag] = useState();
	const [addName, setAddName] = useState();

	const handleInputChange = (event) => {
		setAddName(event.target.value);
	};

	const searchDeal = (searchWord) => {
		getToDo(`q=${searchWord}`);
	};
	const sortDeal = () => {
		getToDo(`${`_sort=name&_order=asc`}`);
	};

	const refreshToDos = () => setRefreshToDosFlag(!refreshToDosFlag);

	const getToDo = (query) => {
		query ? (query = `?${query}`) : (query = '');
		fetch(`http://localhost:3004/todos${query}`)
			.then((loadedData) => loadedData.json())
			.then((loadedToDos) => {
				setToDos(loadedToDos);
			})
			.finally(() => setIsLoading(false));
	};
	useEffect(() => {
		setIsLoading(true);
		getToDo();
	}, [refreshToDosFlag]);

	const requestAddDeal = () => {
		fetch('http://localhost:3004/todos', {
			method: 'Post',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				name: addName,
			}),
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				refreshToDos(response);
			})
			.finally(() => setIsCreating(false));
	};

	return (
		<div className={styles.app}>
			<div>
				<div className={styles.search}>
					<label>Найти задачу</label>
					<input
						type="text"
						onChange={(event) => searchDeal(event.target.value)}
					/>
				</div>
				<button onClick={sortDeal}>Сортировка(А-Я)</button>
				<div>
					<NavLink to="/">
						<h3>Список дел</h3>
					</NavLink>
				</div>
				<ul>
					{isLoading ? (
						<div className="loader"></div>
					) : (
						toDos.map(({ id, name }) => (
							<div key={id} className={styles.item}>
								<NavLink to={`/task/${id}`}>
									<li>
										<p className={styles.deal}>{name}</p>
									</li>
									<Routes>
										<Route
											path="/task/:id"
											element={
												<p className={styles.deal}>
													<Task />
												</p>
											}
										/>
									</Routes>
								</NavLink>
							</div>
						))
					)}

					<form className={styles.newDeal}>
						<div>
							<label>Введите новую задачу</label>
							<input type="text" onChange={handleInputChange} />
							<button disabled={isCreating} onClick={requestAddDeal}>
								Добавить дело
							</button>
						</div>
					</form>
				</ul>
			</div>
		</div>
	);
};
