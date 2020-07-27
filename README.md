# FLog.io
Logging Object for Socket.io // Console.log and Parent-Child Logging over Socket.io<br/>
<br/>
FLog is designed for print logging; helpful in areas such as admin of multiple chat rooms or game servers<br/>
The nested structure allows for the parent to log the output of its children over sockets.<br/>
<br/>
FLog can be enabled to attach to a socket, read the console.log, and utilize a parent-child structure with other FLogs<br/>
<br/>
Create a new FLog by:<br/>
      const FLog=require('./FLog.io');<br/>
      let flog=new FLog('name');<br/>
<br/>
To use the socket function:<br/>
      flog.SetSocket(\_socket);<br/>
  Once connected, the FLog will send a test message over the socket, will attempt a Print call, and then AutoSave will send<br/>
  all log.print calls since instantiation.<br/>
  The FLog will continue to emit all log.print messages through the socket.<br/>
  The receiving message event is the log name. Use log.GetName() to get the log name.<br/>
  A lock parameter is false by default. If set to 'true' the socket cannot be set again.<br/>
<br/>
To enable logging of console.log:<br/>
      set '\_readconsole=true' when using new<br/>
      let flog=new FLog('name',false,true);<br/>
  The FLog will bind to the console.log function and log both the console output and log.print calls.<br/>
  <br/>
To enable parent-child structure logging of multiple FLogs:<br/>
  Bind a child FLog to a parent by:<br/>
      flog.BindChild(childlog);<br/>


  
