(async function () {
  var editorContainer = document.getElementById('editor-container');
  var problem = editorContainer.getAttribute('problem');
  localStorage['problem'] = problem;
  var editor = ace.edit('editor');
  editor.setTheme('ace/theme/monokai');

  // extracting lecture ID from the current page URL
  var url = window.location.toString().split('?');
  var urlParams = window.location.toString().split('/');
  var lecID = urlParams.at(-1);

  // Debouncing Function
  const debouncingFunction = (fn, delay) => {
    let timer;
    return function () {
      let context = this;
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(context, [String(_user_id) + lecID, js.getValue()]);
      }, delay);
    };
  };

  const saveCodeWithDelay = debouncingFunction(saveCode, 300);
  editor.on('change', saveCodeWithDelay);

  var js = new ace.EditSession(`# Write Your Code in Function Here`);
  js.setMode('ace/mode/python');
  var css = new ace.EditSession('');
  css.setMode('ace/mode/python');

  async function fetchCode() {
    var id = String(_user_id) + lecID;
    var response = await getCode(id);
    js.setValue(response);
    var response = await fetchAnswer('Python3');
    localStorage[localStorage['problem']] = JSON.stringify(response);
    css.setValue(JSON.parse(localStorage[localStorage['problem']])['Python3']);
  }

  var lecturePage = document.querySelector('.lecture-page-layout');
  lecturePage.addEventListener('load', async () => {
    var editorContainer = document.getElementById('editor-container');
    localStorage['problem'] = editorContainer.getAttribute('problem');
    await fetchCode();
  });

  async function saveCode(id, code) {
    let data = { [id]: code };
    const response = await fetch(
      'https://algolab-c1646-default-rtdb.firebaseio.com/student_code.json',
      {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const myJson = await response.json();
    console.log('SAVED.');
  }

  async function getCode(id) {
    try {
      const response = await fetch(
        `https://algolab-c1646-default-rtdb.firebaseio.com/student_code/${id}.json`,
        {
          method: 'GET',
        }
      );
      const myJson = await response.json();
      return myJson;
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchAnswer(language) {
    let headers = new Headers();
    headers.append('Authorization', 'Bearer key1P9uct0K334nx0');

    const requestOptions = {
      method: 'GET',
      headers: headers,
      redirect: 'follow',
    };

    var response;
    var formattedResponse;
    try {
      response = await fetch(
        `https://api.airtable.com/v0/appqasx2lkrlZ5e97/leetcode-solutions?filterByFormula=(%7Bproblem-url%7D+%3D+'${localStorage['problem']}')`,
        requestOptions
      );
      formattedResponse = await response.text();
    } catch (err) {
      console.error(err);
    }

    return JSON.parse(formattedResponse).records[0].fields;
  }

  await fetchCode();

  // logic to extract all nodes having class item i.e. <a> tags on the sidebar
  // and then attaching click event listener to all these nodes
  let nodes = document.querySelectorAll('.item');
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].addEventListener('click', function () {
      // grabbing the nextPage URL using data-ss-event-href attribute of <a> tags
      const nextPage = this.getAttribute('data-ss-event-href');
      // loading this page using window.location.href to reload the page
      window.location.href = 'https://courses.algolab.so' + nextPage;
    });
  }

  editor.setTheme('ace/theme/dracula');
  editor.setSession(js);

  const codeTab = document.getElementById('edit-js');
  const cssTab = document.getElementById('edit-css');

  function selectTab(tabId) {
    const lastSelectedTab =
      document.getElementsByClassName('editor-tab--active');
    for (let i = 0; i < lastSelectedTab.length; i += 1) {
      lastSelectedTab[i].classList.remove('editor-tab--active');
    }
    const tab = document.getElementById(tabId);
    tab.classList.add('editor-tab--active');
  }

  const language = document.getElementById('language');

  var lang2lang = {
    python: 'Python3',
    java: 'Java',
    cpp: 'C++',
    javascript: 'JavaScript',
  };

  // defining a state variable of currentLanguage
  let currentLanguage = lang2lang['python'];

  language.addEventListener('change', (e) => {
    currentLanguage = lang2lang[e.target.value];
    js.setMode(`ace/mode/${e.target.value}`);
    css.setMode(`ace/mode/${e.target.value}`);
    css.setValue(
      JSON.parse(localStorage[localStorage['problem']])[currentLanguage]
    );
  });

  codeTab.addEventListener('click', () => {
    editor.setReadOnly(false);
    selectTab('edit-js');
    editor.setSession(js);
  });

  cssTab.addEventListener('click', () => {
    selectTab('edit-css');
    css.setValue(
      JSON.parse(localStorage[localStorage['problem']])[currentLanguage]
    );
    editor.setReadOnly(true);
    editor.setSession(css);
  });
})();
