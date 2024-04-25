  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyA7gVmOR7YnMQks0DTgDIPzCkf8wocMrGk",
    authDomain: "controlerh-b1052.firebaseapp.com",
    projectId: "controlerh-b1052",
    storageBucket: "controlerh-b1052.appspot.com",
    messagingSenderId: "1538615574",
    appId: "1:1538615574:web:d185c9e657554971bac837"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

// Adicione um evento de clique para o botão "Confirmar"
document.addEventListener('DOMContentLoaded', function () {
    const btnConfirmar = document.getElementById('btnConfirmar');

    btnConfirmar.addEventListener('click', function(event) {
        event.preventDefault();

        // Obtenha os valores dos campos do formulário
        const cnpj = document.getElementById('cnpj').value;
        const razaoSocial = document.getElementById('razao-social').value;
        const email = document.getElementById('emailCadastro').value;
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmar-senha').value;

        // Verifique se as senhas coincidem
        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem!');
            return;
        }

        // Cadastre o usuário no Firebase Authentication
        firebase.auth().createUserWithEmailAndPassword(email, senha)
        .then((userCredential) => {
            // Usuário cadastrado com sucesso
            const user = userCredential.user;
            console.log('Usuário cadastrado:', user);

            const db = firebase.firestore();

            // Dados do usuário a serem salvos no Firestore
            const userData = {
                cnpj: cnpj,
                razaoSocial: razaoSocial,
                email: email,
            };
        
            // Salve os dados do usuário no Firestore
            db.collection('usuarios').doc(user.uid).set(userData)
            .then(() => {
                console.log('Dados do usuário salvos no Firestore.');
                
                // Limpe o formulário
                document.getElementById('cadastro-form').reset();

                // Redirecione o usuário para outra página, se necessário
                window.location.href = 'main.html';
            })
            .catch((error) => {
                console.error('Erro ao salvar dados do usuário:', error);
                // Trate o erro aqui, se necessário
            });
        })
        .catch((error) => {
            // Ocorreu um erro durante o cadastro do usuário
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorMessage);
            alert('Erro ao cadastrar usuário: ' + errorMessage);
        });
    });
});




