const socket = io();

const form = document.querySelector('formLogin');

form.addEventListener('submit', event => {
	event.preventDefault();
	const dataForm = new FormData(event.target);
	const userData = Object.fromEntries(dataForm);
	socket.emit('submitLogin', userData);
});