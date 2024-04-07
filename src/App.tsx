import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import { emit, listen } from "@tauri-apps/api/event";
import { ask, message } from "@tauri-apps/api/dialog"
import "./App.css";
import { writeText } from "@tauri-apps/api/clipboard";

function App() {
	const [greetMsg, setGreetMsg] = useState("");
	const [name, setName] = useState("");

	async function greet() {
		// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
		setGreetMsg(await invoke("greet", { name }));
	}

	listen('click', (event) => {
		console.log('event name', event.event);
		console.log('payload', event.payload);
	})

	return (
		<div className="container">
			<h1>Welcome to Tauri!</h1>

			<div className="row">
				<a href="https://vitejs.dev" target="_blank">
					<img src="/vite.svg" className="logo vite" alt="Vite logo" />
				</a>
				<a href="https://tauri.app" target="_blank">
					<img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
				</a>
				<a href="https://reactjs.org" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>

			<p>Click on the Tauri, Vite, and React logos to learn more.</p>

			<form
				className="row"
				onSubmit={(e) => {
					e.preventDefault();
					greet();
				}}
			>
				<input
					id="greet-input"
					onChange={(e) => setName(e.currentTarget.value)}
					placeholder="Enter a name..."
				/>
				<button type="submit">Greet</button>
			</form>

			<p>{greetMsg}</p>
			<div>
				<button id='emit'
					onClick={() => {
						emit('click', {
							theMessage: "Tauri is awesome!"
						})
					}}>emit event</button>
			</div>
			<div>
				<button id='ask'
					onClick={() => {
						ask("Are you sure?", "Tauri")
					}}>ask</button>
			</div>
			<div>
				<button id='message'
					onClick={() => {
						message("Tauri is awesome", "Tauri")
					}}>message</button>
			</div>
			<div>
				<button id='copy'
					onClick={() => {
						writeText("Tauri is awesome!")
					}}>copy to clipboard</button>
			</div>
		</div>
	);
}

export default App;
