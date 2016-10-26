// Welcome! require() some modules from npm (like you were using browserify)
// and then hit Run Code to run your code on the right side.
// Modules get downloaded from browserif y-cdn and bundled in your browser.
/*-----------------------------------------------------
  REQUIRE
-------------------------------------------------------*/
var yo       = require('yo-yo')
var csjs     = require('csjs-inject')
var minixhr  = require('minixhr')
var chart    = require('chart.js')
/*-----------------------------------------------------
  THEME
-------------------------------------------------------*/
var font       = 'Bungee Inline', cursive;
var yellow     = 'hsla(52,35%,63%,1)'
var white      = 'hsla(120,24%,96%,1)'
var violet     = 'hsla(329,25%,45%,1)'
var lightBrown = 'hsla(29,21%,67%,1)'
var darkBrown  = 'hsla(13,19%,45%,1)'
/*-----------------------------------------------------------------------------
  LOADING FONT
-----------------------------------------------------------------------------*/
var links = ['https://fonts.googleapis.com/css?family=Bungee+Inline']
var font = yo`<link href=$links[0] rel="stylesheet" type='text/css'>`
/*-----------------------------------------------------------------------------
LOADING DATA
-----------------------------------------------------------------------------*/
var questions = [
`
Tvrdjenje #1:
Kod kuce provodim puno vremena za kompjuterom.
`,
`
Tvrdjenje #2:
Provodim puno vremena na drustvenim mrezama.
`,
`
Tvrdjenje #3:
Provodim puno vremena poboljsavajuci
  svoje informaticko znanje.
`,
`
Tvrdjenje #4:
Provodim puno vremena igrajuci video igre.
`,
`
Tvrdjenje #5:
Volim da vozim bicikl.
`,
`
Tvrdjenje #6:
Bavim se sportskim aktivnostima.
`
]
var i               = 0
var question        = questions[i]
var results         = []
var answerOptions   = [1,2,3,4,5,6]
/*-----------------------------------------------------------------------------
  QUIZ
-----------------------------------------------------------------------------*/
function quizComponent () {
  var css = csjs`
    .quiz {
      background-color: ${yellow};
      text-align: center;
      font-family: 'Kaushan Script', cursive;
      padding-bottom: 200px;
    }
    .welcome {
      font-size: 4em;
      padding: 50px;
      color: ${darkBrown}
    }
    .question {
      font-size: 2em;
      color: ${white};
      padding: 40px;
      margin: 0 5%;
    }
    .answers {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      margin: 0 5%;
    }
    .answer {
      background-color: ${violet};
      padding: 15px;
      margin: 5px;
      border: 2px solid ${white};
      border-radius: 30%;
    }
    .answer:hover {
      background-color: ${lightBrown};
      cursor: pointer;
    }
    .instruction {
      color: ${violet};
      font-size: 1em;
      margin: 0 15%;
      padding: 20px;
    }
    .results {
      background-color: ${white};
      text-align: center;
      font-family: 'Kaushan Script', cursive;
      padding-bottom: 200px;
    }
    .resultTitle{
      font-size: 4em;
      padding: 50px;
      color: ${darkBrown}
    }
    .back {
      display: flex;
      justify-content: center;
    }
    .backImg {
      height: 30px;
      padding: 5px;
    }
    .backText {
      color: ${white};
      font-size: 25px;
    }
    .showChart {
      font-size: 2em;
      color: ${violet};
      margin: 35px;
    }
    .showChart:hover {
      color: ${yellow};
      cursor: pointer;
    }
    .myChart {
      width: 300px;
      height: 300px;
    }
  `

  function template () {
    return yo`
      <div class="${css.quiz}">
        <div class="${css.welcome}">
          Dobrodosli u moj kviz!
        </div>
        <div class="${css.question}">
          ${question}
        </div>
        <div class="${css.answers}">
          ${answerOptions.map(x=>yo`<div class="${css.answer}" onclick=${nextQuestion(x)}>${x}</div>`)}
        </div>
        <div class="${css.instruction}">
          Izaberite u kojoj meri se slazete za izjavom
          (1 - ne slazem se uopste, 6 - u potpunosti se slazem)
        </div>
           <div class="${css.back}" onclick=${back}>
           <img src="http://i.imgur.com/L6kXXEi.png" class="${css.backImg}">
           <div class="${css.backText}">Back</div>
        </div>
      </div>
    `
  }
  var element = template()
  document.body.appendChild(element)

  return element

  function nextQuestion(id) {
    return function () {
      if (i < (questions.length-1)) {
        results[i] = id
        i = i+1
        question = questions[i]
        yo.update(element, template())
      } else {
        results[i] = id
        sendData(results)
        yo.update(element, seeResults(results))
      }
    }
	}

  function seeResults(data) {
  var ctx = yo`<canvas class="${css.myChart}"></canvas>`
  return yo`
    <div class="${css.results}">
      <div class="${css.resultTitle}">
        Uporedite vase odgovore
      </div>
        <div class="${css.showChart}" onclick=${function(){createChart(ctx, data)}}>
        Kliknite da pogledate grafikon
      </div>
      ${ctx}
    </div>
  `
	}

  function back() {
    if (i > 0) {
      i = i-1
      question = questions[i]
      yo.update(element, template())
    }
  }

  function sendData(results) {
    var request  = {
      url          : 'https://kviz-acc46.firebaseio.com/results.json',
      method       : 'POST',
      data         : JSON.stringify(results)
    }
    minixhr(request)
  }

  function createChart(ctx, myData) {
    minixhr('https://kviz-acc46.firebaseio.com/results.json', responseHandler)
    function responseHandler (data, response, xhr, header) {
      var data = JSON.parse(data)
      var keys = Object.keys(data)
      var arrayOfAnswers = keys.map(x=>data[x])
      var stats = arrayOfAnswers.reduce(function(currentResult,answer,i) {
        var newResult=currentResult.map((x,count)=>(x*(i+1)+answer[count])/(i+2))
        return newResult
      }, myData)
      var data = {
        labels: [
          "kompjuter #1", "drustvene mreze #2", "ucenje #3",
          "video igre #4", "bicikl #5", "sportske aktivnosti #6"
        ],
        datasets: [
          {
            label: "Moji odgovori",
            backgroundColor: "rgba(179,181,198,0.2)",
            borderColor: "rgba(179,181,198,1)",
            pointBackgroundColor: "rgba(179,181,198,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(179,181,198,1)",
            data: myData
          },
          {
            label: "Ostali odgovori",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            pointBackgroundColor: "rgba(255,99,132,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(255,99,132,1)",
            data: stats
          }
        ]
      }
      var myChart = new Chart(ctx, {
        type: 'radar',
        data: data,
        options: {
          scale: {
            scale: [1,2,3,4,5,6],
            ticks: {
              beginAtZero: true
            }
          }
        }
      })
    }
  }

}
quizComponent()
