const socket = io()

const form = document.getElementById('formRegister')

form.addEventListener('submit', event => {
	event.preventDefault();
	const dataForm = new FormData(event.target);
	const userData = Object.fromEntries(dataForm);
	socket.emit('submitRegister', userData);
});