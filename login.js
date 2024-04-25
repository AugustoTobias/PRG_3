document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtenha os valores dos campos de entrada
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Faça login com o Firebase Authentication
    firebase.auth().signInWithEmailAndPassword(username, password)
    .then((userCredential) => {
        // Login bem-sucedido
        const user = userCredential.user;
        console.log('Usuário logado:', user);

        // Redirecione o usuário para outra página, se necessário
        window.location.href = 'main.html';
    })
    .catch((error) => {
        // Ocorreu um erro durante o login
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorMessage);
        alert('Erro ao fazer login: ' + errorMessage);
    });
});

