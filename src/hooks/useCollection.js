import pbclient from "@/lib/db";
import { useCallback, useEffect, useState } from "react";

export function useCollection(collectionName, options = {}) {
	// const pb = pbclient;
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);

	const fetchData = useCallback(async () => {
		try {
			pbclient.autoCancellation(false);
			const res = await pbclient.collection(collectionName).getFullList(options);
			setData(res);
		} catch (err) {
			setError(err);
			console.log(err)
		}
	}, [collectionName, options, pbclient]);

	const createItem = useCallback(async (data) => {
		try {
			const res = await pbclient.collection(collectionName).create(data);
			setData(res);
			return res;
		} catch (err) {
			setError(err);
			console.log(err)
		}
	}, [collectionName, pbclient]);

	const updateItem = useCallback(async (id, data) => {
		try {
			const res = await pbclient.collection(collectionName).update(id, data);
			setData(res);
		} catch (err) {
			setError(err);
			console.log(err)
		}
	}, [collectionName, pbclient]);

	const deleteItem = useCallback(async (id) => {
		try {
			const res = await pbclient.collection(collectionName).delete(id);
			// mutation
			mutation();
		} catch (err) {
			setError(err);
			console.log(err)
		}
	}, [collectionName, pbclient]);

	const mutation = useCallback(() => {
		fetchData();
	}, [fetchData]);

	useEffect(() => {
		fetchData();
	}, []);

	// returning all states
	return {
		data,
		error,
		mutation,
		fetchData,
		createItem,
		updateItem,
		deleteItem
	};
}
