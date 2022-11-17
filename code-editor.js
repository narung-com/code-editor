
  !function(){
    console.log("In function");
    var editorContainer = document.getElementById('editor-container');
    var problem = editorContainer.getAttribute('problem');
    localStorage['problem'] = problem;
    console.log(problem);
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    
    var js = new ace.EditSession(`def findAverage(nums: List[int], k: int) -> float:
    # Your code is not saved.`);
    js.setMode('ace/mode/python');
    var css = new ace.EditSession('');
    css.setMode('ace/mode/python');
    var intervalId = setInterval(function() {
      saveCode(String(_user_id) + lecture_data.lectureId, js.getValue());
    }, 10000);
    
    var solutions = null;
    
    async function fetchCode() {
    
      id = String(_user_id) + lecture_data.lectureId;
      response = await getCode(id);
    
      js.setValue(response)
    
      fetchAnswer("Python3").then((resp) => {
        console.log("inside fetchAnswer" + JSON.stringify(resp));
        localStorage[localStorage['problem']] = JSON.stringify(resp);
        
        css.setValue(JSON.parse(localStorage[localStorage['problem']])["Python3"]);
      });
    }
    window.onload = async function(){
      var editorContainer = document.getElementById('editor-container');
      localStorage['problem'] = editorContainer.getAttribute('problem');
      await fetchCode()
    };
    
    lecturePage = document.querySelector('.lecture-page-layout');
    lecturePage.addEventListener('load', async () => {
      var editorContainer = document.getElementById('editor-container');
      localStorage['problem'] = editorContainer.getAttribute('problem');
      await fetchCode();
    });
      
    
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
    
    async function fetchAnswer(language) {
      let headers = new Headers();
      headers.append('Authorization', 'Bearer key1P9uct0K334nx0');
    
      const requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow',
      };
    
      console.log("In fetchAnswer two-sum -> " + localStorage['problem']);
      
      let response;
      let formattedResponse;
      try {
        response = await fetch(
          `https://api.airtable.com/v0/appqasx2lkrlZ5e97/leetcode-solutions?filterByFormula=(%7Bproblem-url%7D+%3D+'${localStorage['problem']}')`,
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
      'java': 'Java',
      'cpp': 'C++',
      'javascript': 'JavaScript'
    } 
    
    language.addEventListener('change', (e) => {
      
      console.log(JSON.stringify(solutions));
      
      js.setMode(`ace/mode/${e.target.value}`);
      css.setMode(`ace/mode/${e.target.value}`);
      
      css.setValue(JSON.parse(localStorage[localStorage['problem']])[lang2lang[e.target.value]]);
    });
    
    codeTab.addEventListener('click', () => {
      selectTab('edit-js');
      
      editor.setSession(js);
    });
    
    cssTab.addEventListener('click', () => {
      selectTab('edit-css');
      css.setValue(JSON.parse(localStorage[localStorage['problem']])["Python3"]);
      editor.setSession(css);
    });
}();
