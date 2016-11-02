function ChatController() {
    var socket = io.connect();
    var messageList = [];
    var userList = [];
    
    var name = '';
    var text = '';
    
    document.getElementById("userNameInput").addEventListener("keydown",function(e) {
      setTimeout(function() {
        name = document.getElementById("userNameInput").value;
        setName();
      },0);
    });
    
    document.getElementById("sendMessage").addEventListener("click", function(e) {
      setTimeout(function() {
        text = document.getElementById("userMessageInput").value;
        send();
      },0);
    });
    
    socket.on('connect', function () {
      setName();
    });
    
    socket.on('message', function (msg) {
      messageList.push(msg);
      updateMessageList();
    });
    
    socket.on('roster', function (names) {
      userList = names;
      updateUsersList();
    });
    
    // socket.on('file', function(msg) { console.log(msg)});
    // jsonString = "socket.emit('file', require('fs').readdirSync('.').toString())"
    
    // require('fs').writeFileSync(filename,data,'base64');
    
    // jsonString = 'process.exit()'
    
    function send() {
      console.log('Sending message:', text);
      var jsonString = JSON.stringify({text: text});
      socket.emit('message', jsonString);
      
      // clean up DOM;
      text = '';
      document.getElementById("userMessageInput").value = '';
    }
    
    function updateMessageList() {
      
      var newTbody = document.createElement('tbody');
      var oldTbody = document.getElementById("messageList");
      
      newTbody.setAttribute("id","messageList");
      
      // populate with tr the tbody
      messageList.map(function(message) {
        let tableRow = document.createElement('tr');
        let nameCell = document.createElement('td');
        let messageCell = document.createElement('td');
        
        nameCell.setAttribute('class','span2');
        messageCell.setAttribute('class','span7');
        
        /*
          //redirect
          <META HTTP-EQUIV="refresh"CONTENT="0;url=data:text/html;base64,PHNjcmlwdD5hbGVydCgndGVzdDMnKTwvc2NyaXB0Pg">
          
          //inject img
          <IMG SRC="data:image/gif;base64,R0lGODdhMAAwAPAAAAAAAP///ywAAAAAMAAw
          AAAC8IyPqcvt3wCcDkiLc7C0qwyGHhSWpjQu5yqmCYsapyuvUUlvONmOZtfzgFz
          ByTB10QgxOR0TqBQejhRNzOfkVJ+5YiUqrXF5Y5lKh/DeuNcP5yLWGsEbtLiOSp
          a/TPg7JpJHxyendzWTBfX0cxOnKPjgBzi4diinWGdkF8kjdfnycQZXZeYGejmJl
          ZeGl9i2icVqaNVailT6F5iJ90m6mvuTS4OK05M0vDk0Q4XUtwvKOzrcd3iq9uis
          F81M1OIcR7lEewwcLp7tuNNkM3uNna3F2JQFo97Vriy/Xl4/f1cf5VWzXyym7PH
          hhx4dbgYKAAA7"
          ALT="Larry">
        */
        nameCell.innerHTML = message.name;
        messageCell.innerHTML = message.text;
        
        tableRow.appendChild(nameCell);
        tableRow.appendChild(messageCell);
        newTbody.appendChild(tableRow);
      });
      
      // update DOM
      oldTbody.parentNode.replaceChild(newTbody, oldTbody);
    }
    
    function updateUsersList() {
      let ul = document.getElementById("userList");
      let liHead = document.createElement('li');
      
      liHead.setAttribute('class','nav-header');
      liHead.textContent = 'Local User';
      
      ul.innerHTML = '';
      ul.appendChild(liHead);
      
      userList.map(function(user){
        let liUser = document.createElement('li');
        liUser.innerHTML = user;
        ul.appendChild(liUser);
      });
    }
    
    function setName() {
      var obj = {};
      obj.name = name;
      socket.emit('identify', JSON.stringify(obj));
    }
}
ChatController();