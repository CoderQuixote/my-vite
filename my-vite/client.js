const socket = new WebSocket("wss://localhost:3000", 'vite-hmr');

// Listen for messages
socket.addEventListener('message', async ({ data }) => {
    console.log('message', data);
})