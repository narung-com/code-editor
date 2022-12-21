
var editor = ace.edit("editor");

editor.setTheme("ace/theme/monokai");

var js = new ace.EditSession(`# Write Your Code Here.`);
js.setMode('ace/mode/python');
var css = new ace.EditSession('');
css.setMode('ace/mode/python');
var intervalId = setInterval(function() {
  saveCode(String(_user_id) + lecture_data.lectureId, editor.getValue());
}, 10000);

solutions = null;

window.onload = async function(){

  id = String(_user_id) + lecture_data.lectureId, editor.getValue()
  response = await getCode(id)

  js.setValue(response)

  fetchAnswer("palindrome-number", "Python3").then((resp) => {
    solutions = resp;

    css.setValue(solutions["Python3"]);
  });
};

const saveCode = async function (id, code) {
  let data = {[id]: code};
  const response = await fetch('https://algolab-c1646-default-rtdb.firebaseio.com/student_code.json', {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
        }
      });
  const myJson = await response.json();
}
const getCode = async function (id) {
  const response = await fetch(`https://algolab-c1646-default-rtdb.firebaseio.com/student_code/${id}.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
        }
      });
  const myJson = await response.json();
  return myJson;
}

async function fetchAnswer(problemURL, language) {
  let headers = new Headers();
  headers.append('Authorization', 'Bearer key1P9uct0K334nx0');

  const requestOptions = {
    method: 'GET',
    headers: headers,
    redirect: 'follow',
  };

  let response;
  let formattedResponse;
  try {
    response = await fetch(
      `https://api.airtable.com/v0/appqasx2lkrlZ5e97/leetcode-solutions?filterByFormula=(%7Bproblem-url%7D+%3D+'${problemURL}')`,
      requestOptions
    );
    formattedResponse = await response.text();
  } catch (error) {
    return 'Error Occurred';
  }

  return JSON.parse(formattedResponse).records[0].fields;
}

editor.setTheme("ace/theme/dracula");
editor.setSession(js);

const codeTab = document.getElementById('edit-js');
const cssTab = document.getElementById('edit-css');

const selectTab = function (tabId) {
    const lastSelectedTab = document.getElementsByClassName('editor-tab--active');
  for (let i = 0; i < lastSelectedTab.length; i += 1) {
    lastSelectedTab[i].classList.remove('editor-tab--active');
  }
  const tab = document.getElementById(tabId);
  tab.classList.add('editor-tab--active');
}

const language = document.getElementById('language');

var lang2lang = {
  'python': 'Python3',
  'java': 'Java'
} 

language.addEventListener('change', (e) => {
  js.setMode(`ace/mode/${e.target.value}`);
  css.setMode(`ace/mode/${e.target.value}`);
  css.setValue(solutions[lang2lang[e.target.value]]);
});

codeTab.addEventListener('click', () => {
  selectTab('edit-js');
  editor.setSession(js);
});

cssTab.addEventListener('click', () => {
  selectTab('edit-css');
  editor.setSession(css);
});


