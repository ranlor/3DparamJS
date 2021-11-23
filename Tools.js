/************************************************************
 *  ranlor - 2014
 ************************************************************/
/**
 * simple message wrapper
 */

var Message = function(element)
{
    var _e = element;
    
    this.log = function(message)
    {
        _e.innerHTML = message;
    }
    
    this.clear = function() {_e.innerHTML = "";}
}


/***
 * examples code
 */

var Examples = function(continers,btn_click,select_elem)
{
    var _examples = {
      sphere : {p:2,px:'100*sin(t)*cos(s)',py:'100*sin(t)*sin(s)',pz:'100*cos(t)',u_as:'0',u_ae:'2*PI',v_as:'0',v_ae:'PI'},  
      circle : {p:1,px:'100*sin(t)',py:'100*cos(t)',pz:'',u_as:'0',u_ae:'2*PI',v_as:'',v_ae:''},
      torus  : {p:2,px:'(100+(50*cos(t)))*cos(s)',py:'(100+(50*cos(t)))*sin(s)',pz:'50*sin(t)',u_as:'0',u_ae:'2*PI',v_as:'0',v_ae:'2*PI'},  
      helicoid:{p:2,px:'50*s*cos(t)',py:'50*s*sin(t)',pz:'50*t',u_as:'0',u_ae:'2*PI',v_as:'0',v_ae:'2*PI'},  
      cone   : {p:2,px:'t*cos(s)',py:'t*sin(s)',pz:'t',u_as:'-100',u_ae:'100',v_as:'0',v_ae:'2*PI'}
    };
    var _select = select_elem;
    var _final_btn = btn_click;
    
    var dispatchOnChange = function(select)
    {
        if ('createEvent' in document)
        {
            var e = document.createEvent('HTMLEvents');
            e.initEvent('change',true, true);
            select.dispatchEvent(e);
        }
        else
        {
            select.fireEvent('onchange');
        }
    }
    
    var select_onchange = function(select)
    {
        var value = select.options[select.selectedIndex].value;
        if (value==-1) {return false;}
        var data = _examples[value];
        switch (data.p)
        {
            case 1 :continers.type.selectedIndex = 0;break;
            case 2 :continers.type.selectedIndex = 1;break;
        }
        dispatchOnChange(continers.type);
        continers.px.value = data.px;
        continers.py.value = data.py;
        continers.pz.value = data.pz;
        continers.u_as.value = data.u_as;
        continers.u_ae.value = data.u_ae;
        continers.v_as.value = data.v_as;
        continers.v_ae.value = data.v_ae;
        _final_btn.click();
    }
    
    var init = function()
    {
        console.log('examples init called');
        //bind actions
        _select.onchange = function(event) {select_onchange(event.target);}
        select_onchange(_select);
        
    }
    
    init();
    
}
