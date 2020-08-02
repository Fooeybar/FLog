# flog.io
Logging Object For Sockets // Console And Nested Logging<br/>
-
flog.io is designed for nested print logging; helpful in areas such as admin of multiple chat rooms or game servers.<br/>
The nested structure allows for the parent to log the output of its children over sockets.<br/>
Replace your console.log() calls with yourvariable.print(), or use them together.<br/>

<br/>
v3.0.1<br/>
-
---added remove() function

<br/>

npm install flog.io

<br/>

Create a new log by:<br/>
---with or without a config object<br/>
---const flog=require('flog.io')<br/>
---let log=new flog.io({config object})<br/>
<br/>

Default Config Object:<br/>
{<br/>
name:'flog.io'<br/>
,readconsole:false<br/>
,writeconsole:true<br/>
,sockets:[]<br/>
,emitname:'flog.io'<br/>
,parents:[]<br/>
,children:[]<br/>
}<br/>
<br/>

Functions:<br/>
print()<br/>
addsocket(socket)<br/>
addchild(child)<br/>
addparent(parent)<br/>
remove(socket||child||parent)<br/>
<br/>
Using print():<br/>
---using a comma between arguments will start a new line<br/>
---replace the use of console.log() with log.print(), print() will write to the console and send over sockets<br/>
---or use console.log() and flog.io with config {readconsole:true} to also send over sockets<br/>

To enable the socket logging:<br/>
---log.addsocket(socket) -> add a socket to pass print() arguments to using config.emitname<br/>
---The receiving message event by default is config {emitname:'flog.io'}<br/>

To enable parent-child structure logging of multiple logs,<br/>
---log.addchild(child) -> add a child log, the child.print() calls will also call the parent.print()<br/>
---log.addparent(parent) -> add a parent log, to receive child.print() calls<br/>

To remove a socket, child, or parent:<br/>
---log.remove() -> input a socket, child log, or parent log to remove from this log<br/>
<br/>

Future edits will include:<br/>
---error catching (in progress)<br/>
---file logging (in progress)<br/>
<br/>

My apologies, versions 2.0.7 and below were hastily written.<br/>
Version 3.0.0 is the working version.<br/>
All updates going forward should not be breaking.<br/>


  
