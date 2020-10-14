import axios from "axios";
import { useHistory } from "react-router-dom";
import React, { useState } from "react";


export const authUrl="http://localhost:5000/auth"


export default async function checkAuth(token) {
	// const history = useHistory();
	// const [success, setSuccess] = useState(false);
	var success = false;
	var userID = "";
	var userInfo = {};
	const ndata = {
		token: token
	}
	// alert(ndata)
	// const header = new Headers();
	// header.append('Access-Control-Allow-Origin', '*');

	await axios.post(authUrl, ndata)
		.then(function(response) {
			// console.log(response)
			success = true
			userID = response.data.uid
			userInfo = response.data.user_info
			window.sessionStorage.setItem("uid", userID)
		})
		.catch(function(error) {
			console.log(error)

			success = false
		})

		return { "success": success , "userID": userID, "userInfo": userInfo}
};