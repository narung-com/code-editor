
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
        height: 60px;
        font: 12px/normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
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

</style>

<div class="editor-container">
    <ul class="editor-tabs">
      <li id="edit-js" class="editor-tab editor-tab--right-border editor-tab--active">Practice</li>
      <li id="edit-css" class="editor-tab editor-tab--right-border">Solution</li>
      
    </ul>
    <div id="editor" class="editor active">
    </div>
    <button class="editor-fullscreen-closer"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path id="editor-fullscreen-closer__icon" d="M4.5 11H3v4h4v-1.5H4.5V11zM3 7h1.5V4.5H7V3H3v4zm10.5 6.5H11V15h4v-4h-1.5v2.5zM11 3v1.5h2.5V7H15V3h-4z"/></svg></button>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.13.0/ace.js" type="text/javascript" charset="utf-8"></script>
<script>
    
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    
    var js = new ace.EditSession(`def findAverage(nums: List[int], k: int) -> float:
    # Your code is not saved.`);
    js.setMode('ace/mode/python');
    var css = new ace.EditSession(`def findAverage(nums: List[int], k: int) -> float:
        
        windowSum = sum(nums[:k])
        average = windowSum/k
        result = [average]
        
        for i in range(len(nums)-k):
            windowSum = windowSum - nums[i] + nums[i+k]
            average = windowSum/k
            result.append(average)
            
        return result
    `);
    css.setMode('ace/mode/python');

    var intervalId = setInterval(function() {
      console.log(_user_id);
      console.log(editor.getValue());
      saveCode(String(_user_id) + lecture_data.lectureId, editor.getValue());
    }, 5000);
    
    
    window.onload = async function(){
      
      id = String(_user_id) + lecture_data.lectureId, editor.getValue()
      response = await getCode(id)
      //editor.setValue(response)
      console.log("onload called")
      console.log(js.getValue())
      
      js.setValue(response)
    };
    
    const saveCode = async function (id, code) {
      console.log("saveCode");
      let data = {[id]: code};
      console.log(data);
      const response = await fetch('https://algolab-c1646-default-rtdb.firebaseio.com/student_code.json', {
          method: 'PATCH',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
            }
          });
      const myJson = await response.json();
      console.log("respons ....");
      console.log(myJson);
    }

    
    const getCode = async function (id) {
      console.log("getCode");

      console.log(id);
      const response = await fetch(`https://algolab-c1646-default-rtdb.firebaseio.com/student_code/${id}.json`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
            }
          });
      const myJson = await response.json();
      console.log("respons ....");
      console.log(myJson);
      return myJson;
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
    
    codeTab.addEventListener('click', () => {
      selectTab('edit-js');
      editor.setSession(js);
    });
    cssTab.addEventListener('click', () => {
      selectTab('edit-css');
      editor.setSession(css);
    });
    
</script>
