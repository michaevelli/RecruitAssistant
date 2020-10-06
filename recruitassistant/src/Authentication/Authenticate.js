import axios from "axios";
import { useHistory } from "react-router-dom";
import React, { useState } from "react";


export const authUrl="http://localhost:5000/auth"


export default async function checkAuth(token) {
	// const history = useHistory();
	// const [success, setSuccess] = useState(false);
	var success = false;
	const ndata = {
		token: token
	}
	// alert(ndata)
	// const header = new Headers();
	// header.append('Access-Control-Allow-Origin', '*');

	await axios.post(authUrl, ndata)
		.then(function(response) {
			console.log(response)
			success = true
		})
		.catch(function(error) {
			console.log(error)
			// window.localStorage.clear()
			// history.push("/login");
			success = false
		})

		return success
};