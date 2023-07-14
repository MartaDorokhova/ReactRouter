import { useEffect, useState } from 'react';
import { NavLink, useParams, useMatch } from 'react-router-dom';
import styles from './App.module.css';

export const Task = () => {
	const [toDo, setToDo] = useState({
		name: '',
		id: 0,
	});
	const [isLoading, setIsLoading] = useState(false);

	const [isUpdating, setIsUpdating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isChanging, setIsChanging] = useState({ what: false, id: 0 });
	const [refreshToDoFlag, setRefreshToDoFlag] = useState();

	const [updateInput, setUpdateInput] = useState();

	const handleUpdateChange = (event) => {
		setUpdateInput(event.target.value);
	};
	const { id } = useParams();
	const urlMatchData = useMatch('/task/:id');
	console.log(urlMatchData);
	const refreshToDo = () => setRefreshToDoFlag(!refreshToDoFlag);

	const getToDo = () => {
		fetch(`http://localhost:3004/todos/${id}`)
			.then((loadedData) => loadedData.json())
			.then((loadedToDo) => {
				setToDo(loadedToDo);
			})
			.finally(() => setIsLoading(false));
	};
	useEffect(() => {
		setIsLoading(true);
		getToDo();
	}, [refreshToDoFlag]);

	const requestChangeDeal = (id) => {
		setIsChanging({ what: true, id });
	};
	const requestUpdateDeal = (id) => {
		setIsUpdating(true);
		fetch(`http://localhost:3004/todos/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				name: updateInput,
			}),
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('Дело обновлено:', response);
				refreshToDo();
			})
			.finally(() => {
				setIsUpdating(false);
				setIsChanging({ what: false, id });
			});
	};
	const requestDeleteDeal = (id) => {
		setIsDeleting(true);
		fetch(`http://localhost:3004/todos/${id}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('Дело удалено:', response);
				refreshToDo();
			})
			.finally(() => setIsDeleting(false));
	};

	return (
		<div className={styles.app}>
			<ul>
				{isLoading ? (
					<div className="loader"></div>
				) : (
					<div className={styles.item}>
						<p className={styles.deal}>
							{isChanging.what && isChanging.id === id ? (
								<div>
									<input
										className={styles.update}
										type="text"
										name={toDo.name}
										onChange={handleUpdateChange}
										defaultValue={toDo.name}
									/>
									<button
										disabled={isUpdating}
										onClick={() => requestUpdateDeal(id)}
									>
										ОК
									</button>
								</div>
							) : (
								<p className={styles.deal}>{toDo.name}</p>
							)}
							<button onClick={() => requestChangeDeal(id)}>
								Изменить дело
							</button>
							<button
								className={styles.delete}
								disabled={isDeleting}
								onClick={() => requestDeleteDeal(id)}
							>
								Удалить дело
							</button>
							<NavLink to="/">
								<button>Вернуться к списку дел</button>
							</NavLink>
						</p>
					</div>
				)}
			</ul>
		</div>
	);
};
