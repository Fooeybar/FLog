# flog.io
Extended Console.log Factory // Nested And Socket Logging<br/>
-
flog.io is a tool for nested logging.<br/>
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
,sockets:[]   -> sockets array<br/>
,emitname:'flog.io'   -> socket emit event name<br/>
,parents:[]   -> parents array<br/>
,children:[]   -> children array<br/>
,logfile:false   -> log to file<br/>
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
---replace the use of console.log() with log.print(), .print() will write to the console, send over any sockets, and send to any parents<br/>
---or use console.log() and declare a flog.io with 'config={readconsole:true}' to read the console.log() and automatically send to any sockets or parent logs<br/>

To enable the socket logging:<br/>
---log.addsocket(socket) -> add a socket to pass print() arguments to using config.emitname<br/>
---the receiving socket.on(event,args) event by default is {emitname:'flog.io'}<br/>
---sockets can also be added at instantiation<br/>

To use parent-child structure logging of multiple logs:<br/>
---log.addchild(child) -> add a child log, the child.print() calls will also call the parent.print()<br/>
---log.addparent(parent) -> add a parent log, similar to above<br/>
---parents/children can also be added at instantiation<br/>

Log to file:<br/>
---use the config setting 'logfile:true'<br/>
---for nowlogs can be found in the 'flog.io' module folder<br/>