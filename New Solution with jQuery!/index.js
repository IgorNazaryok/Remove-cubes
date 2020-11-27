$( document ).ready(function() {

  const RemoveCubes = () =>{
    const $playingField = $('#js-playingField'); 
    const $buttonStart = $('#start');
    const $buttonNewGame = $('#newGame');
    const $score = $('#score');
    const $userName = $('#name');
    const $buttonSave = $('#save');
    const $lastUser = $('#lastUser');
    const $buttonContinue = $('#сontinue');
    const $points = $('#points');
    const $time = $('#time');


    const colorsCube = {
      none: 'rgba(0, 0, 0, 0)',
      blueviolet: 'rgb(138, 43, 226)',
      goldenrod: 'rgb(218, 165, 32)', 
      red: 'rgb(255, 0, 0)', 
      green: 'rgb(0, 128, 0)'
    };

    let listResult = [];
    let gameTime; // one minute
    isRunGame = false; 
    let startTime, pauseTime=0;
    let timerId;
    let isFirstLevel=true; 
    let totalPoints;
    let fieldSize=64;
    let extraTime=0;  
    FillingResultsTable(); 
    CreateGame();

    $buttonStart.on( "click", function() {
      StartGame();
    });
    $buttonNewGame.on( "click", function() { 
      NewGame();
    });
    $buttonSave.on( "click", function() {
      SaveResult();
    });
    $buttonContinue.on( "click", function() {
      ContinueGame();
    });

      function RemoveListCube ()
      {
        $playingField.find('.js-cube').remove();
      }

      function CreateGame (levelGame='firstLevel')
      {
        switch(levelGame)
        {
          case 'secondLevel':
            RemoveListCube();
            $playingField.append(...GetListCube(144));
            fieldSize=144;          
            break;
          case 'restart':
            {
              RemoveListCube();
              $playingField.append(...GetListCube());
              totalPoints=0;
              $points.text(totalPoints);
              $time.text(`01:00`);
              fieldSize=64; 
            }          
            break;
          default:
            {
              $playingField.append(...GetListCube());
              totalPoints=0;
              $points.text(totalPoints);
              $time.text(`01:00`);            
            }         
            break;
        }     
        const allCubes = $('.js-cube');
        $.each(allCubes, function( key, value ) {     
        addColorAndEventCube(key+1)
        })
      }

      function RemoveCube(el)
      { 
        if (isRunGame)
        {             
        $points.text(GetCountPoints(el));
        el.css({
          background:colorsCube.none,
          border: colorsCube.none
          });
        }
        if (totalPoints>=50 && isFirstLevel)
        {
          StartGame();  
          clearInterval(timerId);
            CreateGame('secondLevel');
            $('#nextLevel').modal({
              backdrop: 'static',
              keyboard: false
          });
          $("#nextLevel").modal('show');
          isFirstLevel=!isFirstLevel;
        }
      }

      function AddCube()
      {
        if (isRunGame)
        {
          let i=0;
          let amountCube=Math.floor(Math.random()*3+1); //generate number cubes  - 0,1,2
          while(i<amountCube)
          {        
            let numberCube= Math.floor((Math.random()*fieldSize)+1); // generate number cube paint
          if ($(`#cube${numberCube}`).css('backgroundColor')==colorsCube.none) //color cube is clear
            {
            addColorAndEventCube(numberCube);
            }
            i++;
          }     
        }      
      }

      function getColorNewCube ()
      {
        let numberColorCube;
        totalPoints>50 ? numberColorCube=Math.floor(Math.random()*5) : 
        totalPoints>20 &&  totalPoints<=50? numberColorCube=Math.floor(Math.random()*4) : numberColorCube=Math.floor(Math.random()*3);
        let color = colorsCube.goldenrod;
          switch (numberColorCube)
          {
            case 1:
              color = colorsCube.blueviolet;
              break;
            case 2:
              color = colorsCube.none;
              break;
            case 3:
              color = colorsCube.red;
              break;
            case 4:
              color = colorsCube.green;
              break;                         
          }
          return color;
      }

      function GetCountPoints(el)
      {
        switch (el.css('background-color'))
        {
          case colorsCube.blueviolet:
            totalPoints++;
            break;
          case colorsCube.goldenrod:
            totalPoints+=2;
            break;
          case colorsCube.red:
            totalPoints+=3;        
            break;
          case colorsCube.green:
            StartGame();
            extraTime++;
            StartGame();
            extraTime--;
            break;          
        }
        return totalPoints
      }

      function GetListCube(fieldSize=64) {    
        const result = [];
        let newCube; 
        $playingField.css('width','510px');
        const size =(Math.floor(+($playingField.css('width').slice(0, -2))/(fieldSize**(1/2))))-(Math.floor(+($playingField.css('width').slice(0, -2))/(fieldSize**(1/2))))%10+'px';
        for(let i=1; i<=fieldSize; i++) {      
          newCube = $("<div></div>")
          .addClass("js-cube")
          .css({
            height: size,
            width: size
          })
          .on( "dblclick", function() {
            AddCube();
          })
          .on( "click", function() {
            AddCube();
          })
          .on( "mouseenter", function() {
            $(this).css('border-radius', '15%');
          })
          .on( "mouseleave", function() {
            $(this).css('border-radius', '0')
          })
          .attr('id', `cube${i}`);

          result.push(newCube);
        }
        return result;
      }
      function Timer (n)
      {          
        timerId = setInterval(()=>{
                        --n;  
                        n>9 ? 
                        $time.text(`00:${n}`):
                        $time.text(`00:0${n}`); 
                        if (n==0)  
                        {
                          clearInterval(timerId);
                          $score.val(totalPoints);
                          $buttonStart.text('START');
                          isRunGame = false;
                          CreateGame('restart');
                          $('#saveModal').on('shown.bs.modal', function () {
                            $('#name').focus();
                          });
                          $('#saveModal').modal({
                            backdrop: 'static',
                            keyboard: false
                        });
                          $("#saveModal").modal('show');
                        };
                      }, 1000);
      }

      function StartGame()
      {
        if (!isRunGame) 
        {
          if(!pauseTime)
          {
            startTime = new Date();
            gameTime=60;
            Timer(gameTime);
          }
          else
          {
            gameTime=gameTime-(Math.floor((pauseTime - startTime)/1000))+extraTime;
            Timer(gameTime);
            startTime = new Date();    
          }
          isRunGame=!isRunGame;
          $buttonStart.text('PAUSE');
        }
        else 
        {
          pauseTime = new Date();    
          clearInterval(timerId)
          isRunGame=!isRunGame;
          $buttonStart.text('START');
        }
      }
      function NewGame()
      {      
        totalPoints=0;
        startTime=pauseTime=null;
        isRunGame = false;
        clearInterval(timerId);
        CreateGame('restart');   
        $points.text(totalPoints);
        $time.text(`01:00`);
        $buttonStart.text('START');     
      }  
      function SaveResult ()
      { 
        if ($userName.val())
        {
        listResult.push(new Object({
          name:  $userName.val(),
          score: $score.val()
        }));  
        localStorage.listResult = JSON.stringify(listResult);      
        AddResultToTable($userName.val(), $score.val());
        $("#saveModal").modal('hide');
         $userName.val('');
         $userName.removeClass('is-invalid');    
        }
        else
        {
           $userName.addClass('is-invalid');
        }
      }
      function ContinueGame()
      {
        $("#nextLevel").modal('hide');
        StartGame(); 
      }

      function AddResultToTable (userName, points)
      {        
        let newResult = $("<tr></tr>");
        let columnName = $("<td></td>");
        let columnResult = $("<td></td>");
        columnName.text(userName);
        columnResult.text(points);
        newResult.append(columnName);
        newResult.append(columnResult);
        $lastUser.after(newResult);
      }

      function FillingResultsTable ()
      {
        listResult = localStorage.listResult ? JSON.parse(localStorage.listResult) : [];
        listResult.forEach(result=>AddResultToTable(result.name, result.score));
      }

      function addColorAndEventCube (number)
      {
        const color = getColorNewCube ();
        const cube = $(`#cube${number}`);
        cube.css({
          backgroundColor:color,
          border:`5px outset ${color}`
        })

        switch (color)
        {
          case colorsCube.none:
            cube.css('border', 'none');          
            break;

          case colorsCube.red:
            cube.on('dblclick',function() {
              RemoveCube($(this));
            })    
            break;

          case colorsCube.green:
            cube.on('dblclick',function() {
              RemoveCube($(this));
            })      
            break;

          default:
            cube.on('click',function() {
              RemoveCube($(this));
            })
            break;                   
        }
      }    
  }
  RemoveCubes();

});