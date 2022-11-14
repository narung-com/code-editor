
<style type="text/css" media="screen">
    #editor { 
      width: 100%;
      height: 100%;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    }
    
    .editor-container { 
      width: 100%;
      height: 500px;
      padding-bottom: 40px;
    }
    
    .editor-tabs {
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      padding: 0px;
      margin: 0;
    		display: flex;
    		background: #2f3240;
        color: #f8f8f2;
      	width: 100%;
        height: 70px;
        font: 10px/normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
    }
    
    .editor-tab {
      
      position: relative;
      appearance: none;
      list-style: none;
      background: transparent;
      padding: 1em 0;
      border: none;
      font: inherit;
      
      cursor: pointer;
      outline: none;
      flex-grow: 1;
      text-align: center;
      transition: color .3s ease;
      z-index: 1;
    }
    
    .editor-tab--active {
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      background-color: #3c3f52;
    }
    
    .editor-tab--right-border {
      border-right-color: #121319;
      border-right-width: 1px;
      border-right-style: solid;
    }
    
    .editor-fullscreen-closer {
      z-index: 20;
      position: absolute;
      right: 5px;
      bottom: 5px;
      background: none;
      border: none;
      cursor: pointer;
    }
    
    #editor-fullscreen-closer__icon {
      fill: #f8f8f2;
    }

    #language {
      color: #ffffff;
      background-color: #2f3240;
      border-radius: 8px;
    }
</style>

<div class="editor-container">
    <ul class="editor-tabs">
      <li id="edit-js" class="editor-tab editor-tab--right-border editor-tab--active">Practice</li>
      <li id="edit-css" class="editor-tab editor-tab--right-border">Solution</li>
      <li id="edit-css" class="editor-tab editor-tab--right-border">
        <select name="language" id="language">
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="javascript">Javascript</option>
          <option value="python" selected>Python</option>
        </select>
        <a id="run-code" href="#">Run</a>
      </li>
    </ul>
    <div id="editor" class="editor active">
    </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.13.0/ace.js" type="text/javascript" charset="utf-8"></script>
<script>
    
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
    
    solutions = null;
    
    window.onload = async function(){
      
      id = String(_user_id) + lecture_data.lectureId
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
    
    const runcode = document.getElementById('run-code');
    
    runcode.addEventListener('click', (e) => {
      console.log("test");
      code = btoa(js.getValue());
      
      const options = {
    	method: 'POST',
    	headers: {
      		'content-type': 'application/json',
      		'Content-Type': 'application/json',
      		'X-RapidAPI-Key': '3114f8b8a0msh865be114f688e1cp171eedjsn32b9e9dbdbd4',
      		'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      	},
      	body: `{"language_id":71,"source_code":"${code}","stdin":"SnVkZ2Uw"}`
      };
      
      fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*', options)
      	.then(createResponse => createResponse.json())
      	.then(createResponse => {
      	  console.log(createResponse)
      	  var intervalId = setInterval(function() {
            
            const options = {
            	method: 'GET',
            	headers: {
            		'X-RapidAPI-Key': '3114f8b8a0msh865be114f688e1cp171eedjsn32b9e9dbdbd4',
            		'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            	}
            };
            
            fetch(`https://judge0-ce.p.rapidapi.com/submissions/${createResponse.token}?base64_encoded=true&fields=*`, options)
            	.then(response => response.json())
            	.then(response => {
            	  output = atob(response.stdout);
            	  console.log(output)
            	 })
            	.catch(err => console.error(err));
          }, 5000);
      	})
      	.catch(err => console.error(err));
    });
    
    
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
    
</script>
