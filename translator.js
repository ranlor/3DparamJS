/************************************************************
 *  ranlor - 2014
 ************************************************************/
/****************************************************************************
 * Sanitizer clears the given equasion from any unexpected strings and
 * returns a string which only expected format
 ****************************************************************************/
var Sanitizer = function(eq)
{
    var _d = new RegExp('[^0-9]','g');; //match everything but numbers
    var _s = new RegExp('[^\/\*\-\+\^\(\)\|]','g'); //match everything but symbols
    var _func = ['sin','cos','tan','acos','asin','atan','arccos','arcsin','arctan','e','exp','log','ln'];
    var _param = ['t','s'];
    var _p = 'pi';
    var _eq = new String(eq).toLowerCase();
    var _ph = ' '; //place holder for removed characters;
    var _eq_sntz = ""; //will hold the sanitized string
    
    var rem_regex = function(regex,src_str)
    {
        return src_str.replace(regex,_ph);
    }
    
    var left_pad_str = function(str,pad_char,repeatitions)
    {
        var pad = '';
        for (var i=0;i<repeatitions;++i)
        {
            pad += pad_char;
        }
        pad += str;
        return pad;
    }
    
    var rem_str = function(rstr,src_str)
    {
        var src = new String(src_str);
        var output = '';
        var temp = '';
        var i = src.indexOf(rstr,0);
        var c = 0;
        while (i!=-1 && c<100)
        {
            temp = rstr;
            temp = left_pad_str(temp,_ph,i-(output.length));
            output += temp;
            i = src.indexOf(rstr,i+rstr.length);
            c++;
        }
        return output;
    }
    
    var deconstruct = function()
    {
        var dcon = {}; //deconstruct object
        dcon.digits = rem_regex(_d,_eq);
        dcon.symbols = rem_regex(_s,_eq);
        for (var i in _func)
        {
            dcon[_func[i]] = rem_str(_func[i],_eq);
        }
        for (var i in _param)
        {
            dcon[_param[i]] = rem_str(_param[i],_eq);
        }
        dcon.pi = rem_str(_p,_eq);
        //console.dir(dcon);
        return dcon;
    }
    
    var reconstruct = function(decon_object,len)
    {
        var output = new Array(len);
        for (var n=0;n<output.length;++n) {output[n]=_ph;}
        
        for (var i in decon_object)
        {
                for(var j=0;j<decon_object[i].length;++j)
                {
                    if (decon_object[i][j]===_ph) {continue;}
                    output[j] = decon_object[i][j];
                }
        }
        
        var str_output = "";
        for(var j=0;j<len;++j)
        {
            if (output[j]===_ph) {continue;}
            str_output += output[j];
        }
        return str_output;
    }
    
    var sanitize = function()
    {
        var d_o = deconstruct();
        _eq_sntz = reconstruct(d_o,_eq.length);
        console.log(_eq_sntz);
    }();
    
    this.get_str = function()
    {
        return _eq_sntz;
    }
    
    this.get_decon = function()
    {
        return deconstruct();
    }
    
    this.recon_object = function (dcon_object,length)
    {
        return reconstruct(dcon_object,length);
    }
    
}

 /**
 * filters functions and parameters into javscript compatible
 * used for expression tree filtering
 */
var JSFilter = function()
{
     var _t = "((this.u_a*i)+this.u_as)";
     var _s = "((this.v_a*j)+this.v_as)";
     var _pi = "Math.PI";
     var _pow = "Math.pow";
     var _func = {acos:"Math.acos",asin:"Math.asin",atan:"Math.atan",arccos:"Math.acos",arcsin:"Math.asin",
            sin:"Math.sin",cos:"Math.cos",tan:"Math.tan",
            arctan:"Math.atan",exp:"Math.exp",e:"Math.exp",log:"Math.log",ln:"Math.log"};

    this.filter = function(str)
    {
        var e = new String(str).toLowerCase();
        if (e=="t") {return _t;}
        if (e=="s") {return _s;}
        if (e=="pi") {return _pi};
        if (e=='^') {return _pow};
        for (var key in _func)
        {
            if (e==key) {return _func[key];}
        }
        return str;
    }
}

/**
 * USES: MathConvert.js
 * converts current sanitized equation to javascript compatible param
 * object
 * param_num : 1 or 2 define the type of the param object
 * eq_strs : an Array which each cell holds a equation string for x,y,z axis
 * range_strs : an Array which each cell holds a range for the parameters (t or t,s)
 */
var Convert2Object = function(param_num,eq_strs,range_strs)
{
    var _resolution = 16;
    var _template = { 
            num : param_num,
            u_as : 0,
            u_ae : 0,
            u_a : 0,
            v_as : 0,
            v_ae : 0,
            init : function()
            {
                this.u_a = (this.u_ae - this.u_as)/_resolution;
                this.v_a = (this.v_ae - this.v_as)/_resolution;
            },
            px : function(i,j) {return 0;},
            py : function(i,j) {return 0;},
            pz : function(i,j) {return 0;}
    };
    

   var _eqs = eq_strs; 
   var _ranges = range_strs;
   var _js_eqs = Array(3);
 
 
  var process_exp = function(exp)
  {
    var filter = new JSFilter();
    var postfix = new PostFixConvert(exp);
    var expTree = new ExpressionTree(postfix.get_postfix(), filter);
    return expTree.infix_expression();
  }
   
   var init_ = function()
   {
        if (typeof PostFixConvert == 'undefined') {console.log('PostFixConvert not found');return;}
        if (typeof ExpressionTree == 'undefined') {console.log('ExpressionTree not found');return;}
        
        for(var i=0;i<_eqs.length;++i)
        {
            _js_eqs[i] = process_exp(_eqs[i]);
            console.log(_js_eqs[i]);
        }
        
        
        /**********************************************
         * create functions
         *********************************************/
        _template.px = function(i,j) 
        {
            var str = _js_eqs[0];
            var v = -1;
            with (_template)
            {
                v = eval(str);
            }
            return v;
        }
        
        _template.py = function(i,j) 
        {
            var str = _js_eqs[1];
            var v = -1;
            with (_template)
            {
                v = eval(str);
            }
            return v;
        }
        
        if (param_num>1)
        {
            _template.pz = function(i,j) 
            {
                var str = _js_eqs[2];
                var v = -1;
                with (_template)
                {
                    v = eval(str);
                }
                return v;
            }
            
        }
        
        /*******************************************************
         * initialize ranges
         ********************************************************/
        //process ranges
        _template.u_as = eval(process_exp(_ranges[0][0]));
        _template.u_ae = eval(process_exp(_ranges[0][1]));
        if (param_num>1)
        {
            _template.v_as = eval(process_exp(_ranges[1][0]));
            _template.v_ae = eval(process_exp(_ranges[1][1]));
        }
        
   }();
   
   var process4view = function(exp)
   {
        var postfix = new PostFixConvert(exp);;
        var expTree = new ExpressionTree(postfix.get_postfix());
        return expTree.infix_expression();
   }
   
   this.print_processed_expressions = function(output)
   {
       var x = "X: "+process4view(_eqs[0])+'<br/>';
       var y = "Y: "+process4view(_eqs[1])+'<br/>';
       var z = "Z: "+process4view(_eqs[2]);
       output.log('processed expressions: <br/> '+x+' '+y+' '+z);
   }
   
   this.get_object = function() {return _template;}
    
}




/****************************************************************************
 * Translates free text in to functions to be used in Engine
 ****************************************************************************/
var Translator = function(form_id,select_id,submit_id,engine_ref,msg_ref)
{
    var _form = document.getElementById(form_id);
    var _select = document.getElementById(select_id);
    var _btn = document.getElementById(submit_id);
    var _f_type = 1; //the function type 1=one parameter or 2=two parameter
    var _this = this;
    
    
    var select_onchange = function(select)
    {
        var value = select.options[select.selectedIndex].value;
        var e = document.getElementById('pz');
        var s = document.getElementById('s_b');
        if (value==1)
        {
            e.setAttribute('style','display:none');
            s.setAttribute('style','display:none');
        }
        else
        {
            e.removeAttribute('style');
            s.removeAttribute('style');
        }
        _f_type = value;
    }
    
    var get_text_value = function(elem_con)
    {
        var c = elem_con.childNodes;
        for (var e in c)
        {
            if (typeof c[e].type == "undefined") {continue;}
            if (c[e].type == 'text') {return c[e].value;}
        }
        return '';
    }
    
    var get_param_ranges = function(param_num)
    {
        var u_as = document.getElementById('t_as').value;
        var u_ae = document.getElementById('t_ae').value;
        var v_as = 0;
        var v_ae = 0;
        if (param_num>1)
        {
            v_as = document.getElementById('s_as').value;
            v_ae = document.getElementById('s_ae').value;
        }
        return [[u_as,u_ae],[v_as,v_ae]];
    }
    
    var btn_click = function(event)
    {
        msg_ref.log("Loading...");
        var px = document.getElementById('px');
        var py = document.getElementById('py');
        var pz = document.getElementById('pz');
        
        
        //sanitize string 
        var px_str = get_text_value(px);
        var py_str = get_text_value(py);
        var pz_str = "";
        if (_f_type>1) {pz_str = get_text_value(pz);}
        var p_ranges = get_param_ranges(_f_type);
        var px_sntz = new Sanitizer(px_str);
        var py_sntz = new Sanitizer(py_str);
        var pz_sntz = new Sanitizer(pz_str);
        //create parameterization object 
        var eqs = [px_sntz.get_str(),py_sntz.get_str(),pz_sntz.get_str()];
        var po = new Convert2Object(_f_type, eqs,p_ranges);
        var param = po.get_object();
        po.print_processed_expressions(msg_ref);
        //send to engine
        engine_ref.addScene(param);
    }
    
    var init = function()
    {
        console.log('init called');
        //bind actions
        _select.onchange = function(event) {select_onchange(event.target);}
        select_onchange(_select);
        
        _btn.onclick = btn_click;
    }
    
    init();
}


