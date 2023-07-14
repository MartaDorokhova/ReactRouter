import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import styles from './App.module.css';

export const Task = () => {
	const [toDo, setToDo] = useState({
		name: '',
		id: 0,
	});
	const [isLoading, setIsLoading] = useState(false);

	const [isDeleting, setIsDeleting] = useState(false);
	const [isChanging, setIsChanging] = useState(false);
	const [refreshToDoFlag, setRefreshToDoFlag] = useState();

	const [updateInput, setUpdateInput] = useState();

	const handleUpdateChange = (event) => {
		console.log(event.target.value);
		console.log(updateInput);
		if (event.target.value) {
			setUpdateInput(event.target.value);
		} else {
			setUpdateInput(toDo.name);
		}
	};
	const { id } = useParams();
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

	const requestChangeDeal = () => {
		setIsChanging(true);
	};
	const requestUpdateDeal = () => {
		if (updateInput) {
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
					setIsChanging(false);
				});
		}
		setIsChanging(false);
	};
	const requestDeleteDeal = () => {
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
						<p>
							{isChanging ? (
								<div>
									<input
										className={styles.update}
										type="text"
										name={toDo.name}
										onChange={handleUpdateChange}
										defaultValue={toDo.name}
									/>
									<button onClick={() => requestUpdateDeal()}>ОК</button>
								</div>
							) : (
								<p>{toDo.name}</p>
							)}
							<button onClick={() => requestChangeDeal()}>Изменить дело</button>
							<NavLink to="/">
								<button
									className={styles.delete}
									disabled={isDeleting}
									onClick={() => requestDeleteDeal()}
								>
									Удалить дело
								</button>
							</NavLink>
							<NavLink to="/">
								<button>Назад</button>
							</NavLink>
						</p>
					</div>
				)}
			</ul>
		</div>
	);
};
