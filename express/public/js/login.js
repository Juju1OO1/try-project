document.getElementById('loginButton').addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    if (result.success) {
        alert('登入成功！');
    } else {
        document.getElementById('error').innerText = result.message;
    }
});