import axios from "axios";
import { useHistory } from "react-router-dom";
import React, { useState } from "react";



export const authUrl="http://localhost:5000/auth"


export default async function checkAuth() {
	const history = useHistory();
	const ndata = {
		token: window.localStorage.getItem("token")
	}
	// alert(ndata)
	const header = new Headers();
	header.append('Access-Control-Allow-Origin', '*');

	await axios.post(authUrl, ndata, header)
		.then(function(response) {
			console.log(response)
      return true;
		})
		.catch(function(error) {
			window.localStorage.clear()
			history.push("/login");
      return false;
		})

		return (<br></br>)
};