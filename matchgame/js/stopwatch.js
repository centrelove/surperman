/**
 * @author centre
 * this js base on jquery
 **/
function Stopwatch(divId){
    var id = divId;
    var _TimeID=null;
    var _Str = "00:00:00:00";
    var _H = 0;       
    var _mm = 0;	
    var _ss = 0;	
    var _ms=0;
    function setTime(){
        _ms++;
        if(_ms>=59){
            _ms = 0;
            _ss++;
            if(_ss>=59){
                _ss = 0;
                _mm++;
                if(_mm>=59){
                    _mm = 0;
                    _H++;
                }
            }
        }
        
        var _Hz = "";
        var _mmz = "";
        var _ssz = "";
        var _TCz = "";
	
        if(_H<10){_Hz = "0";}
        if(_mm<10){_mmz = "0";}
        if(_ss<10){_ssz = "0";}
        if(_ms<10){_TCz = "0";}
	
        _Str = _Hz+_H+":"+_mmz+_mm+":"+_ssz+_ss+":"+_TCz+_ms;
        $("#"+divId).html(_Str);
    }
    
    this.start = function(){
        _TimeID=setInterval(setTime,1);
    }
    
    this.stop = function(){
        if(_TimeID !== null) clearInterval(_TimeID);
    }
    
    this.clear = function(){
        _H = 0;		
        _mm = 0;	
        _ss = 0;	
        _ms=0;
        _Str = "00:00:00:00";
        $("#"+divId).html(_Str);
        if(_TimeID !==null) clearInterval(_TimeID);
    }
}