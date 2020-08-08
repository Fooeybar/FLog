# flog.io
Nested Log Trees // Console And Socket Logging<br/>
-
flog.io is a tool for nested tree logging.<br/>
The nested structure allows for a more varied console.log() usage.<br/>
Replace your console.log() calls with flog.io.print(), or use them together.<br/>

<br/>
v3.2.0<br/>
-
---added file logging<br/>

<br/>
v3.1.3<br/>
-
---added branch checking of existing flog to prevent circular references<br/>
<br/><br/>

npm install flog.io

<br/>

Create new logs by:<br/>
---with or without a config object<br/>
---const flog=require('flog.io')<br/>
---let log=new flog.io({config object})<br/>
<br/>

Default Config Object:<br/>
{<br/>
name:'flog.io'<br/>
,readconsole:false   -> read console.log() calls<br/>
,writeconsole:true   -> send to console.log()<br/>
,logfile:false   -> save a log file<br/>
,sockets:[]   -> sockets array<br/>
,emitname:'flog.io'   -> socket emit event name<br/>
,parents:[]   -> parents array<br/>
,children:[]   -> children array<br/>
}<br/>
<br/>

Functions:<br/>
.print(arguments)<br/>
.addsocket(socket)<br/>
.addchild(child)<br/>
.addparent(parent)<br/>
.removesocket(socket)<br/>
.removechild(child)<br/>
.removeparent(parent)<br/>
<br/>
Using print():<br/>
---using a comma between arguments will start a new line<br/>
---replace the use of console.log() with .print(), .print() will write to the console, send over any sockets, save to a log file, and send to any parents<br/>
---or use console.log() and declare a flog.io with 'readconsole:true' to read the console.log() and automatically send to any log files, sockets, or parent logs<br/>

To use nested tree logging:<br/>
---.addchild(child) -> add a child log, the child.print() calls will also call the parent.print()<br/>
---.addparent(parent) -> add a parent log, similar to above<br/>
---.removechild(child) -> remove a child log<br/>
---.removeparent(parent) -> remove a parent log<br/>
---parents/children can also be added at instantiation<br/>
---Children copy their parents to the child's .print() calls, and those parents will copy their parents to the .print() call, etc<br/>
---Create any tree structure you like<br/>

Log to file:<br/>
---use the config setting 'logfile:true'<br/>
---every new flog.io has its own log file<br/>
---for now logs can be found in the 'flog.io' module folder<br/>

To enable the socket logging:<br/>
---.addsocket(socket) -> add a socket to pass print() arguments to using config.emitname<br/>
---the receiving socket.on(event,args) event by default is 'emitname:'flog.io''<br/>
---sockets can also be added at instantiation<br/>
