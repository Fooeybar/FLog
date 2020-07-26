# FLog
Logging Object for Socket.io // Console.log and Parent-Child Logging over Socket.io

FLog is designed for print logging,

FLog can be enabled to attach to a socket, read the console.log, and utilize a parent-child structure with other FLogs.

Create a new FLog by:<br/>
      const FLog=require('./FLog');<br/>
      let flog=new FLog('log1');<br/>
<br/>
To use the socket function, set '\_socketable=true' when using new:<br/>
      let flog=new FLog('name',true);<br/>
  Then when you have a connected socket:<br/>
      flog.SetSocket(\_socket);<br/>
  Once connected, the FLog will send a test message over the socket, will attempt a Print call, and then AutoSave will send<br/>
  all log.print calls since instantiation.<br/>
  The FLog will continue to emit all log.print messages through the socket.<br/>
  The receiving message event is the log name. Use log.GetName() to get the log name.<br/>
<br/>
To enable logging of console.log:<br/>
      set '\_consol=true' when using new<br/>
      let flog=new FLog('name',true,true);<br/>
  The FLog will bind to the console.log function and log both the console output and log.print calls.<br/>
  <br/>
To enable parent-child structure logging of multiple FLogs:<br/>
  FLog is by default an orphan child log.<br/>
      set '\_parent=true' for FLog to be the parent log<br/>
  A parent FLog will FLog.print only to itself and the console.<br/>
  <br/>
  Bind a child FLog to a parent by:<br/>
      let flog2=new FLog('log2');<br/>
      flog.BindChild(flog2);<br/>
  A bound child FLog will Flog.print only to itself and it's parent, the parent will print to the console.log for the child.<br/>
  If the parent is socket enabled the parent will also emit through the socket for the child.<br/>
  
