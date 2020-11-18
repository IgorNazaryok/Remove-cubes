const RemoveCubes = () =>{
  const playingField = document.querySelector('#js-playingField'); 
  const buttonStart = document.querySelector('#start');
  const buttonNewGame = document.querySelector('#newGame');
  const score = document.querySelector('#score');
  const userName = document.querySelector('#name');
  const buttonSave = document.querySelector('#save');
  const lastUser = document.querySelector('#lastUser');
  const erorrName = document.querySelector('#error');
  const buttonContinue = document.querySelector('#сontinue');
  

  const colorsCube = {
    color1: 'none',
    color2: 'blueviolet',
    color3: 'goldenrod',
    color4: 'red',
    color5: 'green'
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

  buttonStart.addEventListener('click', StartGame)
  buttonNewGame.addEventListener('click', NewGame)
  buttonSave.addEventListener('click', SaveResult)
  buttonContinue.addEventListener('click', ContinueGame)

    function RemoveListCube ()
    {
      const allCubes = document.querySelectorAll('.js-cube');
      allCubes.forEach((cube)=>cube.remove());
    }
    function CreateGame (levelGame='firstCreate')
    {
      switch(levelGame)
      {
        case 'secondLevel':
          RemoveListCube();
          playingField.append(...GetListCube(144));
          fieldSize=144;          
          break;
        case 'restart':
          {
            RemoveListCube();
            playingField.append(...GetListCube());
            document.querySelector('#points').innerText=totalPoints=0;
            document.querySelector('#time').innerText=`01:00`;
            fieldSize=64; 
          }          
          break;
        default:
          {
          playingField.append(...GetListCube());
          document.querySelector('#points').innerText=totalPoints=0;
          document.querySelector('#time').innerText=`01:00`;             
          }         
          break;
      } 
      const allCubes = document.querySelectorAll('.js-cube');
      allCubes.forEach((cube)=>addColorAndEventCube(cube));
    }

    function RemoveCube(el)
    { 
      if (isRunGame)
      {
        document.querySelector('#points').innerText=GetCountPoints(el);
        el.target.style.background = el.target.style.border =colorsCube.color1;
      }
      if (totalPoints>=50 && isFirstCreate)
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
        if (document.querySelector(`#cube${numberCube}`).style.background.includes(colorsCube.color1)) //color cube is clear
          {
          addColorAndEventCube(document.querySelector(`#cube${numberCube}`));
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
      let color = colorsCube.color3;
        switch (numberColorCube)
        {
          case 1:
            color = colorsCube.color2;
            break;
          case 2:
            color = colorsCube.color1;
            break;
          case 3:
            color = colorsCube.color4;
            break;
          case 4:
            color = colorsCube.color5;
            break;                         
        }
        return color;
    }

    function GetCountPoints(el)
    {      
      switch (el.target.style.background)
      {
        case colorsCube.color2:
          totalPoints++;
          break;
        case colorsCube.color3:
          totalPoints+=2;
          break;
        case colorsCube.color4:
          totalPoints+=3;        
          break;
        case colorsCube.color5:
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
      document.documentElement.clientHeight<800 ? playingField.style.width = '510px': playingField.style.width = '600px';
      for(let i=1; i<=fieldSize; i++) {
        newCube = document.createElement('div');
        newCube.className = "js-cube";
        newCube.style.height=newCube.style.width=(Math.floor(playingField.offsetWidth/(fieldSize**(1/2))))-(Math.floor(playingField.offsetWidth/(fieldSize**(1/2))))%10+1+'px' 
        console.log(document.documentElement.clientHeight);
        newCube.id = `cube${i}`;
        result.push(newCube);
        newCube.addEventListener('dblclick', AddCube);
        newCube.addEventListener('click', AddCube); 
      }    
      return result;
    }
    function Timer (n)
    {          
      timerId = setInterval(()=>{
                      --n;  
                      n>9 ? 
                      document.querySelector('#time').innerText=`00:${n}`:
                      document.querySelector('#time').innerText=`00:0${n}`; 
                      if (n==0)  
                      {
                        clearInterval(timerId);
                        score.value=totalPoints;
                        buttonStart.innerText='START';
                        isRunGame = false;
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
        buttonStart.innerText='PAUSE';
      }
      else 
      {
        pauseTime = new Date();    
        clearInterval(timerId)
        isRunGame=!isRunGame;
        buttonStart.innerText='START';
      }
    }
    function NewGame()
    {      
      totalPoints=0;
      isRunGame = false;
      clearInterval(timerId);
      CreateGame('restart');   
      document.querySelector('#points').innerText=totalPoints;
      document.querySelector('#time').innerText=`01:00`;
      buttonStart.innerText='START';     
    }  
    function SaveResult ()
    { 
      if (userName.value)
      {
      listResult.push(new Object({
        name: userName.value,
        score: totalPoints
      }));  
      localStorage.listResult = JSON.stringify(listResult);      
      AddResultToTable(userName.value, totalPoints);
      userName.value='';
      $("#saveModal").modal('hide');         
      }
      else
      {
        erorrName.value="Please, enter you name";
      }
    }
    function ContinueGame()
    {
      $("#nextLevel").modal('hide');
      StartGame(); 
    }

    function AddResultToTable (userName, points)
    {
      let newResult = document.createElement('tr');
      let columnName = document.createElement('td');
      let columnResult = document.createElement('td');
      columnName.innerText=userName;
      columnResult.innerText=points;
      newResult.append(columnName);
      newResult.append(columnResult);
      lastUser.after(newResult);
    }

    function FillingResultsTable ()
    {
      listResult = localStorage.listResult ? JSON.parse(localStorage.listResult) : [];
      listResult.forEach(result=>AddResultToTable(result.name, result.score));
    }

    function addColorAndEventCube (el)
    {
      let color = getColorNewCube ();
      el.style.background = color;
      el.style.border = `5px outset ${color}`;
      switch (color)
      {
        case colorsCube.color1:
          el.style.border = 'none';          
          break;
        case colorsCube.color4:
          el.addEventListener('dblclick', RemoveCube, {once: true});     
          break;
        case colorsCube.color5:
          el.addEventListener('dblclick', RemoveCube, {once: true});         
          break;
        default:   
          el.addEventListener('click', RemoveCube, {once: true})
          break;          
      }
    }    
}
RemoveCubes();