/* 
 * converts and checks the vadility of a given math expression string
 * converts it to a valid javascript expression to be evaluated
 */

var MathConvert = function() //name space
{
    this.inArray = function(array,element)
    {
        for (var i=0;i<array.length;++i)
        {
            if (array[i]==element) {return true;}
        } 
        return false;
    }
    
    /**
     * Simple fixed sized stack
     */
    this.Stack = function()
    {
        var initSize = 256;
        var _c = new Array(initSize);
        var _len = 0;
        
        
        this.push = function(element)
        {
            if (_len+1 > initSize) {return false;} //stack overflow
            _len++;
            _c[_len] = element;
            return true;
        }
        
        this.pop = function()
        {
            if (_len==0) {return false;} //stack underflow
            var element = _c[_len];
            _len--;
            return element;
        }
        
        this.peek = function()
        {
            return _c[_len];
        }
        
        this.empty = function()
        {
            return _len==0;
        }
    }
    
    this.Node = function(value)
    {
        this.parent = null;
        this.left = null;
        this.right = null;
        this.value = value;
    }
    
    
    /**
     * Converts a expression from inFix format to prefix format
     */
    this.PostFixConvert = function(expression)
    {
        //operators precedence (high number more precedence)
        var _op_pr = {'+':2,'-':2,'/':3,'*':3,'^':4}; 
        //operators associativity
        var _op_as = {'+':'left','-':'left','/':'left','*':'left','^':'right',')':'right','(':'left'}; 
        var _op = ['+','-','*','/','(',')','^'];
        var _func = ['sin','cos','tan','acos','asin','atan','arccos','arcsin','arctan','e','exp','log','ln'];
        var _stack = new Stack();
        var _postfix_str = "";
        var _exp=new String(expression);
        
        var read_token = function(exp,offset)
        {
            var token = "";
            var e = new String(exp);
            if (offset >= e.length) {return false;} 
            for (var i=offset;i<e.length;++i)
            {
                if (inArray(_op,e[i]))
                {
                    return token;
                }
                else
                {
                    token += e[i];
                }
            }
            return token;
        }
        
        var is_func_token = function(token)
        {
            for (var i=0;i<_func.length;++i)
            {
                if (token==_func[i]) {return true;}
            }
            return false;
        }
        
        
        var is_op_token = function(token)
        {
            for (var i=0;i<_op.length;++i)
            {
                if (token==_op[i]) {return true;}
            }
            return false;
        }
        /**
         *search for every instance of minus '-' alone or
         *'(-' minus with parentasis and change it to '0-' or
         *'(0-' accordigly
         */
        var format_negative = function(expression)
        {
            if (expression.length==0) {return expression;}
            var new_expression = "";
            for(var i=1;i<expression.length;++i)
            {
                if (expression[i]=='-' && expression[i-1]=='(')
                {
                    new_expression += '0';
                }
                new_expression += expression[i];
            }
            
            if (expression[0]=='-') {new_expression = '0-'+new_expression;}
            else {new_expression = expression[0]+new_expression;}
            return new_expression;
        }
        
        //convert
        var convert = function()
        {
            _exp = format_negative(_exp);
            console.log(_exp);
            if (_exp.length==0) {return false} //empty expression
            if (inArray(_op,_exp[0]) && _exp[0]!='(' ) {return false;} //starts with an operator
            var token = read_token(_exp,0);
            var pos = (token.length-1);
            var op = '';
            while(_exp.length>pos)
            {
                if (token.length>0) //avoid adding empty tokens
                {
                    if (is_func_token(token)) {_stack.push(token);} //if a function token add to stack
                    else {_postfix_str += ','+token;}
                } 
                if (pos+1>=_exp.length) {break;}
                pos++;
                
                op = _exp[pos];
                if (_stack.empty()) {_stack.push(op);}
                else
                {
                    if (op==')')
                    {
                        while(_stack.peek()!='(' && !_stack.empty())
                        {
                            _postfix_str += ','+_stack.pop();
                        }
                        if (_stack.empty()) {return false;} //mismatch parenthsis
                        _stack.pop(); //remove '('
                        if (is_func_token(_stack.peek())) {_postfix_str += ','+_stack.pop();}
                    }
                    
                    if (op!='(' && op!=')')
                    {
                        //if topstack operator is equal in precedence to the new operator and is left associative
                        //or the topstack operator has less precedence than the new opeator 
                        while( (_op_pr[op]==_op_pr[_stack.peek()] && _op_as[_stack.peek()]=='left') ||
                               (_op_pr[_stack.peek()]<_op_pr[op]))
                       {
                           _postfix_str += ','+_stack.pop();
                       }
                    }  
                    if (op!=')')
                    {
                        _stack.push(op);
                    }
                    
                }
                ++pos;
                token = read_token(_exp,pos);//read after operator
                pos += (token.length-1);
                if (pos>=_exp.length) {break;}
                
            }
            
            while(!_stack.empty()) {_postfix_str += ','+_stack.pop();}
            _postfix_str = new String(_postfix_str).substr(1); //remove first comma
            return true;
        }
        
        this.get_postfix = function () {return _postfix_str;}
        
        convert();
    }
    
    /**
     *Creates an expression tree from an math expression in postfix form
     *will return a string of the given expression in infix form
     *postfix_expression = a math expression in postfix form
     *filter = (Optional) a filter object must contain methods: 
     * function filter(string) will return the filtered value of the given string
     */
    this.ExpressionTree = function(postfix_expression,filter)
    {
        var _fo = typeof filter == 'undefined' ? null : filter;
        var _pfe = new String(postfix_expression).split(',');
        var _bin_op = ['+','-','*','/','^']; //binary operators
        var _bin_func = ['^']; //binary funtions
        var _un_op = ['sin','cos','tan','acos','asin','atan','arccos','arcsin','arctan','e','exp','log','ln']; //unary operators
        var _root = null;
        var _stack = new Stack();
        var _output = "";
        
        var is_bin_op = function(token)
        {
            for (var i=0;i<_bin_op.length;++i)
            {
                if (token==_bin_op[i]) {return true;}
            }
            return false;
        }
        
        var is_bin_func = function(token)
        {
            for (var i=0;i<_bin_func.length;++i)
            {
                if (token==_bin_func[i]) {return true;}
            }
            return false;
        }
        
        var is_un_op = function(token)
        {
            for (var i=0;i<_un_op.length;++i)
            {
                if (token==_un_op[i]) {return true;}
            }
            return false;
        }
        
        
        /*
        var postfix_print = function(node)
        {
            if (node != null)
            {
                postfix_print(node.right);
                postfix_print(node.left);
                console.log(node.value);
            }
        }*/
        
        
        var infix_print = function(node)
        {
            if (node != null)
            {
                if (is_bin_op(node.value) || is_un_op(node.value))
                {
                    _output += '(';
                }
                if (is_bin_func(node.value)) //special binary functions func(arg1,arg2) in postfix format
                {
                    _output += _fo==null ? node.value : _fo.filter(node.value);
                    _output += '(';
                    infix_print(node.left);
                    _output += ',';
                    infix_print(node.right);
                    _output += ')';
                }
                else //binary and unary opreators in infix format
                {
                    infix_print(node.left);
                    _output += _fo==null ? node.value : _fo.filter(node.value);
                    if (is_un_op(node.value)) {_output += '(';}
                    infix_print(node.right);
                    if (is_un_op(node.value)) {_output += ')';}
                }
                if (is_bin_op(node.value) || is_un_op(node.value))
                {
                    _output += ')';
                }
            } 
        }
        
        var print_tree = function()
        {
            _output = "";
            //postfix_print(_root);
            infix_print(_root);
        }
        
        this.infix_expression = function() {return _output;}        
        
        
        var create_tree = function()
        {
            var temp = null;
            var value = null;
            for (var i=0;i<_pfe.length;++i)
            {
                if (!(is_un_op(_pfe[i]) || is_bin_op(_pfe[i]))) //not any kind of operator
                {
                    _stack.push(new Node(_pfe[i]));
                    //console.log(_pfe[i]);
                }
                else
                {
                    if (is_bin_op(_pfe[i])) //if binary operator
                    {
                        temp = new Node(_pfe[i]);
                        if (_stack.empty()) {return false;}
                        temp.right = _stack.pop();
                        if (_stack.empty()) {return false;}
                        temp.left = _stack.pop();
                        _stack.push(temp);
                    }
                    else //if unary operator
                    {
                        temp = new Node(_pfe[i]);
                        if (_stack.empty()) {return false;}
                        temp.right = _stack.pop();
                        temp.left = null;
                        _stack.push(temp);
                    }
                }
                temp = null;
            }
            _root = _stack.pop();
            print_tree();
        }();
        
    }
    
}();


