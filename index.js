class Usuario {
    constructor(nomeUsuario, nome, imagemPerfil, urlPerfil) {
        this.nomeUsuario = nomeUsuario;
        this.nome = nome;
        this.imagemPerfil = imagemPerfil;
        this.urlPerfil = urlPerfil;
        this.Favorito = false;
    }
}

const usuarios = {};

function printTodosUsuarios() {
    for (let perfilProcurado in usuarios) {
        console.log(`Resultados da pesquisa para "${perfilProcurado}":`);
        usuarios[perfilProcurado].forEach(usuario => {
            console.log(`Nome de usuário: ${usuario.nomeUsuario}`);
            console.log(`Nome: ${usuario.nome}`);
            console.log(`Imagem do perfil: ${usuario.imagemPerfil}`);
            console.log(`URL do perfil: ${usuario.urlPerfil}`);
            console.log(`Estrela: ${usuario.Favorito}`);
            console.log('------------------------');
        });
    }
}

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function adicionaUsuario(perfilProcurado) {

    if (usuarios[perfilProcurado]) {
        throw new Error('Este usuário já está cadastrado!');
    }

    if (Object.keys(usuarios).length >= 5) {
        throw new Error('Máximo de usuários alcançado!');
    }

    if (usuarios[perfilProcurado]) {
        console.log(`Resultados da pesquisa para "${perfilProcurado}":`);
        console.log(usuarios[perfilProcurado]);
    } else {
        fetch(`https://api.github.com/search/users?q=${perfilProcurado}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Não foi possível obter os dados da API");
                }
                return response.json();
            })
            .then(data => {
                const resultados = data.items.map(user => {
                    return new Usuario(user.login, user.name, user.avatar_url, user.html_url);
                });
                usuarios[perfilProcurado] = resultados;
            })
            .catch(error => {
                console.error(error);
            });
    }
}

function deletaUsuario(perfilProcurado) {
    if (usuarios[perfilProcurado]) {
        delete usuarios[perfilProcurado];
        console.log(`Usuário ${perfilProcurado} removido com sucesso.`);
    } else {
        console.log(`Usuário ${perfilProcurado} não encontrado.`);
    }
}

function alternaEstrela(perfilProcurado) {
    if (usuarios[perfilProcurado]) {
        usuarios[perfilProcurado].forEach(usuario => {
            if (usuario.Favorito) {
                usuario.Favorito = false;
            }
            else {
                usuario.Favorito = true;
            }
            console.log(`Estrela de ${usuario.nomeUsuario} alterada para: ${usuario.Favorito}`);
        });
    } else {
        console.log(`Usuário ${perfilProcurado} não encontrado.`);
    }
}

function iniciar() {
    rl.question('Digite 1 para adicionar um usuário, 2 para imprimir todos os usuários ou 0 para sair: ', (resposta) => {
        if (resposta === '1') {
            rl.question('Digite o nome de usuário do GitHub: ', (perfilProcurado) => {
                adicionaUsuario(perfilProcurado);
                iniciar(); 
            });
        } else if (resposta === '2') {
            printTodosUsuarios();
            iniciar(); 
        } else if (resposta === '3') {
            rl.question('Digite o nome de usuário a ser removido: ', (perfilProcurado) => {
                deletaUsuario(perfilProcurado);
                iniciar();
            });
        } else if (resposta == '4'){
            rl.question('Digite o nome de usuário a receber a estrela: ', (perfilProcurado) => {
            alternaEstrela(perfilProcurado);
            iniciar();
            });
        }else if (resposta === '0') {
            rl.close(); 
        } else {
            console.log('Opção inválida. Por favor, digite 1, 2 ou 0.');
            iniciar();
        }
    });
}

iniciar();