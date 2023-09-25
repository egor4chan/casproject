function randomInteger(min, max) {
    // случайное число от min до (max+1)
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  function contains(arr, elem) {
    return arr.find((i) => i === elem) != -1;
}

$('#auth').on('click', function() {
    alert('Авторизация временно недоступна!')
})



$('.bet-panel > button').on('click', function(){ 
    $('.notification').css('opacity', '1');
})

// Banners navigation

$('.games-list > div').on('click', function(){
    return Location('/index.html')
})




    $('#info').on('click', function(){
        $.post('show_mines', {
            'hash': 'kek'
        })
    }, function(data) { console.log('Data is ', data) })





///$(this).css('background-color', 'rgb(41, 126, 132)');
///$(this).css('scale', '0.95');


let session;

function setDefaultMinesCSS(){
    $('.place > div').css('scale', '1');
    $('.place > div').css('background-color', 'aqua');
    $('.place > div').css('box-shadow', 'none');
}

function collectGame() {
    let hash = $('#play').value;
    $('#play').attr('onclick', 'createGame()');
    if ($('#play').html() == 'Забрать') {
        $('#play').html('Играть');
        setDefaultMinesCSS()
        $('.place > div').on('click', function(){});
        session = 'close';
        $.post('server/collect.php', {
            'hash': hash
        }, function(data) { console.log(data) })
    }

    else {
        createGame();
    }
}

function createGame() {
    let hash;
    $('#play').attr('onclick', 'collectGame()');
    if ($('#play').html() == 'Играть') {
        $('#play').html('Забрать');
        
        setDefaultMinesCSS()
        let session = 'open';
        let mines_count = document.getElementById('mines-count').value;
        let bet = document.getElementById('bet-count').value;
        let mines_list = [];
        hash = Number(randomInteger(10000, 20000));

        $('#play').attr('value', hash); // присваиваем value = hash

        while (mines_list.length != Number(mines_count)) {
            random_int = randomInteger(1, 25);
            if (mines_list.includes(random_int) == false) {
                mines_list.push(Number(random_int));
            }   
        }
        console.log('Mines list: ', mines_list)
        $.post('server/handler.php', { // отправляю запрос в PHP с пмощью AJAX 
            'hash': hash, // random int/srting
            'client_id': 1, // user_id
            'bet': bet, // ставка
            'mines_count': mines_count, // количество мин
            'mines_positions': JSON.stringify(mines_list), // ОШИБКА, почему то добавляетсяне список, а значение ARRAY
            'step': 0 // шаг в минах
        }, function(data) {console.log(data)}) // вывожу значение PHP data в консоль

        $('.place > div').on('click', function(){
            if (session == 'open') {

                $.post('test.php', {
                    'hash': hash
                }, function returndata(data) {
                    data = JSON.parse(data)
                    
                    let mines_list_from_db = data;
                }) 


                mine_id = this.id; // mine_id = id элемента HTML
                if ($('#play').html() == 'Забрать') {
                    if (mines_list.includes(Number(mine_id)) == false) { // Если список мин не содержит нажатую ячейку
                    // AJAX
                        $.post('server/steps.php', {
                            'hash': hash
                        }, function(data){ console.log(data) })


                    // CSS 
                        $(this).css('background-color', 'rgb(41, 126, 132)');
                        $(this).css('scale', '0.95');
                    }
                
                    else { // если наступил на мину
                        console.log('Mines in game is ', mines_list)
                        $(this).css('background-color', 'red');
                        $(this).css('box-shadow', '0px 0px 50px red');
                        $(this).css('scale', '0.95');
                        $('#play').html('Играть');
                        session = 'close';
                        mines_list = []
                    }
                }

        // $(this).css('background-color', 'rgb(41, 126, 132)');
        // $(this).css('scale', '0.95');
            }
        })
    }
    
}
