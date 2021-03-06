let svgWidth = document.getElementById("line_chart_view").clientWidth;
let svgHeight = document.getElementById("line_chart_view").clientHeight;
let yearsTotal = [1930, 1934, 1938, 1942, 1946, 1950, 1954, 1958, 1962,
  1966, 1970, 1974, 1978, 1982, 1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018];
for (let i in yearsTotal) {
  yearsTotal[i] = yearsTotal[i].toString();
}
let colors = ['red', 'blue', 'yellow', 'green', 'purple', 'orange', 'black'];

let countries = ['France', 'Croatia']
//轴和网格绘制
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
var lines = []; //保存折线图对象
var xMarks = [];
var lineNames = ['French']; //保存系列名称
var lineColor = ["#F00", "#09F", "#0F0"];
var w = svgWidth;
var h = svgHeight;
var padding = 5;
var padding_left = 15;
var padding_right = 30;
var currentLineNum = 0;

//用一个变量存储标题和副标题的高度，如果没有标题什么的，就为0
var head_height = padding;
// var title = "各球队历年总得分统计图";
// var subTitle = "1930年到2018年";

//用一个变量计算底部的高度，如果不是多系列，就为0
var foot_height = padding;

//图例的预留位置
foot_height += 25;

//定义画布
var svg = d3.select("#line_chart_view")
  .append("svg")
  .attr("width", w - padding_left - padding_right)
  .attr("height", h - 2 * padding)
  .attr("transform", "translate(" + padding_left + "," + padding + ")");

var tooltip = d3.select("#line_chart_view").append("div")
  .attr("class", "tooltip") //用于css设置类样式
  .attr("opacity", 0.0);
maxdata = 25;
let xTrans = 200;

let years = [1930, 1934, 1938, 1942, 1946, 1950, 1954, 1958, 1962,
  1966, 1970, 1974, 1978, 1982, 1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018];
var xScale = d3.scale.ordinal()
  .domain(years)
  .rangeRoundBands([padding_left, w - padding_left - padding_right - xTrans]);

//纵坐标轴比例尺
var yScale = d3.scale.linear()
  .domain([0, maxdata])
  .range([h - foot_height, head_height]);

var line = d3.svg.line()
  .x(function (d) {
    return xScale(d.x) + xTrans + padding_left;
  })
  .y(function (d) {
    return yScale(d.y);
  })
  .interpolate('linear')


//定义横轴网格线
var xInner = d3.svg.axis()
  .scale(xScale)
  .tickSize(-(h - head_height - foot_height), 0, 0)
  .tickFormat("")
  .orient("bottom")
  .ticks(10);

//添加横轴网格线
var xInnerBar = svg.append("g")
  .attr("class", "inner_line")
  // .attr("transform", "translate(0," + (h - foot_height) + ")")
  .attr("transform", "translate(0" + xTrans + ',' + (h - foot_height) + ")")
  .call(xInner);

//定义纵轴网格线
var yInner = d3.svg.axis()
  .scale(yScale)
  .tickSize(-(w - padding * 2), 0, 0)
  .tickFormat("")
  .orient("left")
  .ticks(10);

//添加纵轴网格线
var yInnerBar = svg.append("g")
  .attr("class", "inner_line")
  .attr("transform", "translate(" + xTrans + ",0)")
  .call(yInner);

//定义横轴
var xAxis = d3.svg.axis()
  .scale(xScale)
  .orient("bottom")
  .ticks(10);

//添加横坐标轴
var xBar = svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(" + xTrans + "," + (h - foot_height) + ")")
  .call(xAxis);

//通过编号获取对应的横轴标签
// let i = 0;
xBar.selectAll("text")
  .text(function (d, i) { return years[i]; });

//定义纵轴
var yAxis = d3.svg.axis()
  .scale(yScale)
  .orient("left")
  .ticks(10);

//添加纵轴
var yBar = svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(" + xTrans + ",0)")
  .call(yAxis);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

d3.csv('data/data01.csv', (error, data) => {
  if (error) console.log('error accured!');
  // console.log(data)

  var teamAData = d3.nest()
    .key(function (d) { return d.team_a; })
    .entries(data);

  var teamBData = d3.nest()
    .key(function (d) { return d.team_b; })
    .entries(data);


  let teamA = getCountyData(teamAData, 'score_a', 'pk_a');
  let teamB = getCountyData(teamBData, 'score_b', 'pk_b');
  // console.log(teamA)
  // console.log(teamB)

  let teamNames = [];
  pushTeamName(teamA, teamNames);
  pushTeamName(teamB, teamNames);
  // console.log(teamNames)

  let teamTotal = [];
  for (let i = 0; i < teamNames.length; i++) {
    let tempTeam = {};
    tempTeam.name = teamNames[i];
    tempTeam.years = yearsTotal;
    let scores = [];
    scores.length = yearsTotal.length;
    for (let j in scores) {
      scores[j] = 0;
    }
    tempTeam.score = scores;
    teamTotal.push(tempTeam);
  }
  // console.log(teamTotal)

  //通过输入国家名字得到最终结果
  function ChooseCountry (country) {
    let temp = {};
    temp.name = country;
    for (let i in teamA) {
      if (teamA[i].name == country) {
        temp.year = teamA[i].years;
        temp.score = teamA[i].score;
      }
    }

    for (let j in teamB) {
      if (teamB[j].name == country) {
        for (let k in teamB[j].year) {
          if ((temp.year.indexOf(teamB[j].year[k])) != -1) {
            temp.score[temp.year.indexOf(teamB[j].year[k])] += teamB[j].score[k]
          } else {
            temp.year.push(teamB[j].years[k]);
            temp.score.push(teamB[j].score[k]);
          }
        }
      }
    }
    return temp;
  }

  function pushTeamName (teams, result) {
    for (let i in teams) {
      if (result.indexOf(teams[i].name) == -1) {
        result.push(teams[i].name);
      }
    }
  }

  function getCountyData (teamData, scoreType, scorePk) {
    let result = [];
    for (let i in teamData) {
      let currentCountry = teamData[i].values;
      let countryData = {};
      countryData.name = teamData[i].key;
      let years = [];
      let score = [];

      for (let j in currentCountry) {
        let currentYear = currentCountry[j].years;

        if (!(years.indexOf(currentYear) + 1)) {
          years.push(currentYear);
        }
      }

      for (let x in currentCountry) {
        let currentYear = currentCountry[x].years;

        for (let a in years) {
          if (years[a] == currentYear) {
            if (!score[a]) score[a] = 0;
            score[a] += parseInt(currentCountry[x][scoreType]);
            score[a] += parseInt(currentCountry[x][scorePk]);
          }
        }
      }

      countryData.years = years;
      countryData.score = score;
      result.push(countryData);
    }
    return result;
  }

  function getData (input) {
    let result = [];
    let temp = {};
    for (let i in input.year) {
      temp.name = input.name;
      temp.x = input.year[i];
      temp.y = input.score[i];
      result.push(temp);
      temp = {};
    }
    return result;
  }

  // let France = ChooseCountry('France');
  // let Yugoslavia = ChooseCountry('Yugoslavia');

  // console.log(getData(France))



  drawLines();

  function drawLines () {
    // console.log(countries)

    for (let i in countries) {
      let data = getData(ChooseCountry(countries[i]));
      svg.append('path')
        .attr('class', 'line')
        .attr('d', line(data))
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .attr("stroke", colors[i]);

      svg.selectAll('.circle' + i)
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'circle' + i)
        .attr('r', 3)
        .attr('cx', function (d) {
          return xScale(d.x) + xTrans + padding_left;
        })
        .attr('cy', function (d) {
          return yScale(d.y);
        })
        .attr("fill", "white")
        .attr("stroke-width", 1.5)
        .attr("stroke", colors[i])

      svg.append('text')
        .attr('class', 'tuli')
        .data(data)
        .text(function (d) { return d.name })
        .attr('x', 60)
        .attr('y', 25 + 15 * i)

      svg.append('rect')
        .data(data)
        .attr('class', 'tulifang')
        .attr('width', 10)
        .attr('height', 10)
        .attr('x', 40)
        .attr('y', 15 + 15 * i)
        .attr('fill', colors[i])
    }
  }

  // document.getElementById('button').addEventListener('click', function () {
  //   console.log('clicked')
  // })



  function update () {
    d3.select("#line_chart_view").selectAll('.line').remove();
    d3.select("#line_chart_view").selectAll('circle').remove();
    d3.select("#line_chart_view").selectAll('.tuli').remove();
    d3.select("#line_chart_view").selectAll('.tulifang').remove();

    console.log('updated')
    // countries = ['France', 'France']
    drawLines();
  }

  let oldName = COUNTRY_NAME[country_id[0]];
  setInterval(function () {
    if (COUNTRY_NAME[country_id[0]] != oldName) {
      // console.log(COUNTRY_NAME[country_id[0]])
      if (country_id[0] == -1) {
        countries[0] = null;
      } else {
        countries[0] = COUNTRY_NAME[country_id[0]];
      }

      if (country_id[1] == -1) {
        countries[1] = null;
      } else {
        countries[1] = COUNTRY_NAME[country_id[1]];
      }
      // console.log(countries)
      // countries.push(COUNTRY_NAME[country_id[0]]);
      update();
    }
  }, 1000);


  // update();
})

//无重复地插入数组
function push_noRepeat (array, value) {
  if (!(array.indexOf(value) + 1)) {
    array.push(value);
  }
}





