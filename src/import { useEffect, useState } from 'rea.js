import { useEffect, useState } from 'react';
import {
	Route,
	Routes,
	NavLink,
	Outlet,
	useParams,
	useMatch,
	Navigate,
} from 'react-router-dom';
import styles from './App.module.css';

const fetchProductsList = () => [
	{
		name: 'помыть посуду',
		id: 1,
	},
	{
		name: 'сделать зарядку',
		id: 2,
	},
	{
		name: 'доделать домашку',
		id: 3,
	},
	{
		name: 'пообедать креветками',
		id: 4,
	},
];

const fetchProduct = (id) =>
	({
		1: { id: 1, name: 'Телевизор', price: 42342, amount: 5 },
		2: { id: 2, name: 'Смартфон', price: 442, amount: 10 },
		3: { id: 3, name: 'Планшет', price: 56465442, amount: 23 },
	}[id]);

const ListDeal = () => <div>Список дел</div>;
const Catalog = () => (
	<div>
		<h3>Каталог дел</h3>
		<ul>
			{fetchProductsList().map(({ id, name }) => (
				<li key={id}>
					<NavLink to={`product/${id}`}>{name}</NavLink>
				</li>
			))}
		</ul>
		<Outlet />
	</div>
);

const ProductNotFound = () => <div>Такого товара не существует</div>;
const Product = () => {
	const params = useParams();
	const urlMatchData = useMatch('/catalog/product/:id');
	console.log(urlMatchData);
	const product = fetchProduct(params.id);
	if (!product) {
		return <ProductNotFound />;
	}
	const { name, price, amount } = product;
	return (
		<div>
			<h3>Товар - {name}</h3>
			<div>Цена: {price}</div>
			<div>Осталось на складе: {amount} шт</div>
		</div>
	);
};
const Contacts = () => <div>Контент контактов</div>;
const NotFound = () => <div>Такая страница не существует</div>;

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
					/>{' '}
				</div>
				<button onClick={sortDeal}>Сортировка(А-Я)</button>
				<div>
					<h3>Список дел</h3>{' '}
				</div>
				<ul>
					{isLoading ? (
						<div className="loader"></div>
					) : (
						toDos.map(({ id, name }) => (
							<div key={id} className={styles.item}>
								<NavLink to="product/:id">
									{' '}
									<li>
										<p className={styles.deal}>{name}</p>
									</li>
								</NavLink>
								<Route>
									<Route path="product/:id" element={<Product />} />
								</Route>
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

					<li>
						<NavLink to="catalog">Каталог</NavLink>
					</li>
					<li>
						<NavLink to="contacts">Контакты</NavLink>
					</li>
				</ul>
			</div>
			<Routes>
				<Route path="/" element={<ListDeal />} />
				<Route path="/catalog" element={<Catalog />}>
					{/* <Route path="product/:id" element={<Product />} /> */}
				</Route>
				<Route path="/contacts" element={<Contacts />} />
				<Route path="/404" element={<NotFound />} />
				<Route path="*" element={<Navigate to="/404" />} />
			</Routes>
			<Routes>
				<Route path="/catalog" element={<Catalog />}>
					<Route path="product/:id" element={<Product />} />
				</Route>{' '}
			</Routes>
		</div>
	);
};
