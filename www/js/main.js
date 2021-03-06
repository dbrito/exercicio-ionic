// var app = angular.module('starter', ['ui.router']);
var app = angular.module('starter');

// configure our routes
app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('principal', {
        url: '/',
        templateUrl: 'views/home.html',
        controller: 'homeController'
    });
    $stateProvider.state('criar', {
        url: '/criar',
        templateUrl: 'views/criar.html',
        controller: 'criarController'
    });
    $urlRouterProvider.otherwise('/');
});

app.controller('homeController', function($scope, $gerenciadorTarefas) {
    $scope.tarefas = $gerenciadorTarefas.buscaTarefas();
    $scope.mostrarTerminadas = true;

    $scope.filtroTarefas = function(tarefa) {
        if (tarefa.terminada == true && $scope.mostrarTerminadas == false) {
            return false;
        }
        return true;
    }

    $scope.mostrar = function () {
        $scope.mostrarTerminadas = !$scope.mostrarTerminadas;
    }

    $scope.removeTarefasTerminadas = function () {
        $gerenciadorTarefas.removeTarefasTerminadas();
        $scope.tarefas = $gerenciadorTarefas.buscaTarefas();
    }
});

app.controller('criarController', function($scope, $gerenciadorTarefas) {
    $scope.tarefa = {
        nome: '',
        prazo: '',
        terminada: false
    }

    $scope.criarTarefa = function () {
        $gerenciadorTarefas.adicionarTarefa($scope.tarefa);
        window.location.href = '#/'
    }
});

app.factory('$gerenciadorTarefas', function(){
    var tarefas = [
        {nome:"Tarefa 1", prazo: "27/08/2019", terminada:false},
        {nome:"Tarefa 2", prazo: "27/08/2019", terminada:true},
    ]

    function buscaTarefas() {
        // Se existir histórico de tarefas no browser recupero o mesmo
        if (localStorage.getItem('tarefas')) {
            tarefas=JSON.parse(localStorage.getItem('tarefas'));
        }
        return tarefas;
    }

    function adicionarTarefa(novaTarefa) {
        tarefas.push(novaTarefa);
        atualizarNoLocalStorage();
    }

    function removeTarefasTerminadas() {
        console.log(tarefas);
        var temp = tarefas.filter((tarefa) => {
            return (!tarefa.terminada);
        });
        tarefas = temp;
        atualizarNoLocalStorage();
    }

    //Uso essa funcção para guardar as informações no browser do usuário
    function atualizarNoLocalStorage() {
        var historico = [];
        tarefas.forEach((tarefa) => {
            historico.push({
                nome: tarefa.nome,
                prazo: tarefa.prazo,
                terminada: tarefa.terminada
            });
        })
        window.localStorage.setItem('tarefas', JSON.stringify(historico));
    }

    return {
        buscaTarefas,
        adicionarTarefa,
        removeTarefasTerminadas
    }
});