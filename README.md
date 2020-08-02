# flog.io
Logging Object For Sockets // Console And Nested Logging<br/>
<br/>
flog.io is designed for nested print logging; helpful in areas such as admin of multiple chat rooms or game servers.<br/>
The nested structure allows for the parent to log the output of its children over sockets.<br/>
Replace your console.log() calls with yourvariable.print(), or use them together.<br/>

npm install flog.io<br/>

Create a new log by:<br/>
---const flog=require('flog.io');<br/>
---let yourvariable=new flog.io({config});<br/>

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

To enable parent-child structure logging of multiple logs, <br/>
---add a child log to a parent by -> yourvariable.addchild(child);<br/>
---add a parent log to a child by -> yourvariable.addparent(parent);<br/>

To enable the socket logging:<br/>
---yourvariable.addsocket(socket);<br/>
---Once connected the log will continue to emit all yourvariable.print() messages through the sockets.<br/>
---The receiving message event by default is 'flog.io'<br/>

To enable logging of console.log:<br/>
---set 'readconsole=true'<br/>
---The log will bind to the console.log functions and print both the console output and yourvariable.print() calls.<br/>

Future edits will include:<br/>
---(very soon) remove socket/child/parent<br/>
---asynchronous functions<br/>
---file logging<br/>
---temp line holding<br/>

My apologies, versions 2.0.7 and below were hastily written.<br/>
Version 3.0.0 is the 100% working version.<br/>
All updates going forward should not be breaking.<br/>


  
