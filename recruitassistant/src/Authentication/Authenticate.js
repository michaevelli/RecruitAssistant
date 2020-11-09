import axios from "axios";
import { useHistory } from "react-router-dom";
import React, { useState } from "react";


export const authUrl="http://localhost:5000/auth"


export default async function checkAuth(token) {
	var success = false;
	var userID = "";
	var userInfo = {};
	const ndata = {
		token: token,
		refreshToken: window.localStorage.getItem("refreshToken")
	}

	await axios.post(authUrl, ndata)
		.then(function(response) {
			// console.log(response)
			success = true
			userID = response.data.uid
			userInfo = response.data.user_info
			var token = response.data.token
			window.localStorage.setItem("token", token)
			window.sessionStorage.setItem("uid", userID)
		})
		.catch(function(error) {
			console.log(error)

			success = false
		})

		return { "success": success , "userID": userID, "userInfo": userInfo}
};