var Shapes = function()
{
    //for backface culling all the elements has to have
    //at least 3 points (9 cells) each different
    var _this = this;
    
     /**
     * num_points : resolution of the shape
     * cx,cy,cz : center of the shape
     * params : {
     *  px : function for x point 
     *  py : function for y point
     * }
     * each fumction gets one integers and returns a point 
     * for that component
     */
    var param1 = function(points_num,cx,cy,cz,params)
    {
        var shape = {};
        var x,y,z = 0;
        var c=[];
        var pi=0;
        for (var i=0;i<points_num;++i)
        {
            c = [];
            x = cx+params.px(i);
            y = cy+params.py(i);
            z = cz
            c.push(x,y,z);
            x = cx+params.px(i+1);
            y = cy+params.py(i+1);
            z = cz
            c.push(x,y,z);
            c.push(cx,cy,cz);
            shape['p'+pi] = c;
            ++pi;
        }
        return shape;
        
    }
    
    /**
     * num_points : resolution of the shape
     * cx,cy,cz : center of the shape
     * params : {
     *  px : function for x point 
     *  py : function for y point
     *  pz : function for z point
     * }
     * each function gets two integers and returns a point 
     * for that component
     */
    var param2 = function(points_num,cx,cy,cz,params)
    {
        var shape = {};
        var x,y,z = 0;
        var c=[];
        var pi=0;
        for (var i=0;i<points_num;++i)
        {
            for (var j=0;j<points_num;++j)
            {
                c = [];
                x = cx+params.px(i,j);
                y = cy+params.py(i,j);
                z = cz+params.pz(i,j);
                c.push(x,y,z);
                x = cx+params.px(i,j+1);
                y = cy+params.py(i,j+1);
                z = cz+params.pz(i,j+1);
                c.push(x,y,z);
                x = cx+params.px(i+1,j+1);
                y = cy+params.py(i+1,j+1);
                z = cz+params.pz(i+1,j+1);
                c.push(x,y,z);
                x = cx+params.px(i,j);
                y = cy+params.py(i,j);
                z = cz+params.pz(i,j);
                c.push(x,y,z);
                x = cx+params.px(i+1,j);
                y = cy+params.py(i+1,j);
                z = cz+params.pz(i+1,j);
                c.push(x,y,z);
                x = cx+params.px(i+1,j+1);
                y = cy+params.py(i+1,j+1);
                z = cz+params.pz(i+1,j+1);
                c.push(x,y,z);
                shape['p'+pi] = c;
                ++pi;
            }
        }
        return shape;
    }
    
    /**
     * num_points : resolution of the shape
     * cx,cy,cz : center of the shape
     * params : {
     *  num: number of params, (1 or 2)
     *  init : function to inialize the parameters
     *  px : function for x point 
     *  py : function for y point
     *  pz : function for z point (optional)
     * }
     * each fumction gets one or two integers and returns a point 
     * for that component
     */
    var param = function(points_num,cx,cy,cz,params)
    {
        var pn = parseInt(params.num,10);
        params.init();
        switch (pn)
        {
            case 1 :return param1(points_num,cx,cy,cz,params);
            case 2 :return param2(points_num,cx,cy,cz,params);
        }
    }
    
    this.Box = function(w,h,d,cx,cy,cz) //width,height,depth
    {
        w = w/2;
        h = h/2;
        d = d/2;
        
        var box= {
           back :  [cx-w,cy-h,cz-d,
                    cx-w,cy+h,cz-d,
                    cx+w,cy+h,cz-d,
                    cx-w,cy-h,cz-d,
                    cx+w,cy-h,cz-d,
                    cx+w,cy+h,cz-d],
           front :  [cx-w,cy-h,cz+d,
                    cx-w,cy+h,cz+d,
                    cx+w,cy+h,cz+d,
                    cx-w,cy-h,cz+d,
                    cx+w,cy-h,cz+d,
                    cx+w,cy+h,cz+d],
           m1 : [cx+w,cy+h,cz-d,cx+w,cy+h,cz+d,cx+w,cy-h,cz-d],
           m2 : [cx+w,cy-h,cz-d,cx+w,cy-h,cz+d,cx-w,cy-h,cz-d],
           m3 : [cx-w,cy-h,cz-d,cx-w,cy-h,cz+d,cx-w,cy+h,cz-d],
           m4 : [cx-w,cy+h,cz-d,cx-w,cy+h,cz+d,cx+w,cy+h,cz-d]
        };
        
        return box;
    }
    
    this.Circle = function(point_num,radius,cx,cy,cz)
    {
       var params = {
            num : 1,
            r : radius,
            u_as : 0,
            u_ae : Math.PI*2,
            u_a : 0,
            init : function()
            {
                this.u_a = (this.u_ae - this.u_as)/point_num;
            },
            px : function(i,j) 
            {
                return this.r*Math.cos(this.u_a*i+this.u_as);
            },
            py : function(i,j)
            {
                return this.r*Math.sin(this.u_a*i+this.u_as);
            }
        }
        return param(point_num,cx,cy,cz,params);
    }
    
    this.Cycloid = function(point_num,radius,cx,cy,cz)
    {
       var params = {
            num : 1,
            r : radius,
            u_as : 0,
            u_ae : Math.PI*2,
            u_a : 0,
            init : function()
            {
                this.u_a = (this.u_ae - this.u_as)/point_num;
            },
            px : function(i,j) 
            {
                return this.r*(this.u_a*i+this.u_as-Math.sin(this.u_a*i+this.u_as));
            },
            py : function(i,j)
            {
                return this.r*(1-Math.cos(this.u_a*i+this.u_as));
            }
        }
        return param(point_num,cx,cy,cz,params);
    }
    
    this.Sphere = function(point_num,radius,cx,cy,cz)
    {
        var params = {
            num : 2,
            r : radius,
            u_as : 0,
            u_ae : Math.PI,
            u_a : 0,
            v_as : 0,
            v_ae : Math.PI*2,
            v_a : 0,
            init : function()
            {
                this.v_a = (this.v_ae - this.v_as)/point_num;
                this.u_a = (this.u_ae - this.u_as)/point_num;
            },
            px : function(i,j) 
            {
                return this.r*Math.sin(this.u_a*i+this.u_as)*Math.cos(this.v_a*j+this.v_as);
            },
            py : function(i,j)
            {
                return this.r*Math.sin(this.u_a*i+this.u_as)*Math.sin(this.v_a*j+this.v_as);
            },
            pz : function(i,j)
            {
                return (this.r*Math.cos(this.u_a*i+this.u_as));
            }
        }
        return param(point_num,cx,cy,cz,params);
    }
    
    this.Cone = function(point_num,radius,cx,cy,cz)
    {
        var params = {
            num : 2,
            u_as : 0, //u parameter start
            u_ae : Math.PI*2, //u parameter end
            u_a : 0, //step for u parementer
            v_as : -radius, //v parameter start
            v_ae : radius, //v parameter end
            v_a : 0, //step for va parameter
            init : function()
            {
                this.v_a = (this.v_ae - this.v_as)/point_num;
                this.u_a = (this.u_ae - this.u_as)/point_num;
            },
            px : function(i,j) 
            {
                return ((i*this.v_a)+this.v_as)*Math.cos((this.u_a*j+this.u_as));
            },
            py : function(i,j)
            {
                return ((i*this.v_a)+this.v_as)*Math.sin((this.u_a*j+this.u_as));
            },
            pz : function(i,j)
            {
                return ((i*this.v_a)+this.v_as);
            }
        }
        return param(point_num,cx,cy,cz,params);
    }
    
    this.Pyramid = function(point_num,radius,cx,cy,cz)
    {
        
        var params = {
            num : 2,
            u_as : 0, //u parameter start
            u_ae : Math.PI*2, //u parameter end
            u_a : 0, //step for u parementer
            v_as : 0, //v parameter start
            v_ae : radius, //v parameter end
            v_a : 0, //step for va parameter
            init : function()
            {
                this.v_a = (this.v_ae - this.v_as)/point_num;
                this.u_a = (this.u_ae - this.u_as)/point_num;
            },
            px : function(i,j) 
            {
                return ((i*this.v_a)+this.v_as)*Math.cos((this.u_a*j+this.u_as));
            },
            py : function(i,j)
            {
                return ((i*this.v_a)+this.v_as)*Math.sin((this.u_a*j+this.u_as));
            },
            pz : function(i,j)
            {
                return ((i*this.v_a)+this.v_as);
            }
        }
        return param(point_num,cx,cy,cz,params);
    }
    
    this.Torus =  function(point_num,radius,radius2,cx,cy,cz)
    {
        var params = {
            num : 2,
            r_1 : radius,
            r_2 : radius2,
            u_as : 0,
            u_ae : Math.PI*2,
            u_a : 0,
            v_as : 0,
            v_ae : Math.PI*2,
            v_a : 0,
            init : function()
            {
                this.v_a = (this.v_ae - this.v_as)/point_num;
                this.u_a = (this.u_ae - this.u_as)/point_num;
            },
            px : function(i,j) 
            {
                return (this.r_1+this.r_2*Math.cos(this.u_a*i+this.u_as))*Math.cos(this.v_a*j+this.v_as);
            },
            py : function(i,j)
            {
                return (this.r_1+this.r_2*Math.cos(this.u_a*i+this.u_as))*Math.sin(this.v_a*j+this.v_as);
            },
            pz : function(i,j)
            {
                return (this.r_2*Math.sin(this.u_a*i+this.u_as));
            }
        }
        return param(point_num,cx,cy,cz,params);
    }
    
    
    this.Test =  function(point_num,cx,cy,cz)
    {
        var params = {
            num : 2,
            u_as : 0,
            u_ae : Math.PI*2,
            u_a : 0,
            v_as : 0,
            v_ae : Math.PI*2,
            v_a : 0,
            init : function()
            {
                this.v_a = (this.v_ae - this.v_as)/point_num;
                this.u_a = (this.u_ae - this.u_as)/point_num;
            },
            px : function(i,j) 
            {
                return (this.u_a*i+this.u_as)+Math.sin((this.u_a*i+this.u_as)*(this.v_a*j+this.v_as));
            },
            py : function(i,j)
            {
                return (this.u_a*i+this.u_as)+(this.v_a*j+this.v_as);
            },
            pz : function(i,j)
            {
                return (this.u_a*i+this.u_as)*(this.v_a*j+this.v_as);
            }
        }
        return param(point_num,cx,cy,cz,params);
    }
    
    
    this.Grid  = function(length,segments_num,cy)
    {
        var cx = -length/2;
        var cz = cx;
        var params = {
            num : 2,
            u_as : 0, //u parameter start
            u_ae : length, //u parameter end
            u_a : 0, //step for u parementer
            v_as : 0, //v parameter start
            v_ae : length, //v parameter end
            v_a : 0, //step for va parameter
            yd : cy,
            init : function()
            {
                this.v_a = (this.v_ae - this.v_as)/segments_num;
                this.u_a = (this.u_ae - this.u_as)/segments_num;
            },
            px : function(i,j) 
            {
                return ((i*this.v_a)+this.v_as);
            },
            py : function(i,j)
            {
                return this.yd;
            },
            pz : function(i,j)
            {
                return ((j*this.u_a)+this.u_as);
            }
        }
        return param(segments_num,cx,cy,cz,params);
    }
    
    
    this.Origin = function(length)
    {
        var l = length < 2 ? 2 : length;
        var yl = l;
        var s = 5; //scale of the labels
        var Origin = {
            yAxis : [0,0,0,0,yl,0,0,0,0],
            xAxis : [0,0,0,l,0,0,0,0,0],
            zAxis : [0,0,0,0,0,l,0,0,0],
            yLabel: [1*s,yl,0,2*s,yl-(1*s),0,1*s,yl-(2*s),0],
            yLabel2:[1*s,yl-(2*s),0,2*s,yl-(1*s),0,3*s,yl-(2*s),0],
            xLabel1:[l-(2*s),-(1*s),0,l-(1*s),-(2*s),0,l,-(1*s),0],
            xLabel2:[l-(2*s),-(3*s),0,l-(1*s),-(2*s),0,l,-(3*s),0], 
            zLabel :[0,-(1*s),l,0,-(1*s),l-(2*s),0,-(3*s),l,0,-(3*s),l-(2*s)]
        }
        
        return Origin;
    }
    
    
    this.setParam = function(param_object)
    {
        return param(16,0,0,0,param_object);
    }
}

/////////////////////////////////////////////////////////////////////////////////
// vector 3D object homogenoius 3D vector
///////////////////////////////////////////////////////////////////////////////
var Vector3D = function(vec)
{
    var _this = this;
    var X = 0;
    var Y = 1;
    var Z = 2;
    var W = 3; //projection
    var _v = [0.0,0.0,0.0,1.0];
    if (typeof vec != "undefined")
    {
        vec[W] = 1.0;
        _v = vec;
    }

    
    //more efficient than calling 3 different methods
    this.reset = function(x,y,z,w) 
    {
        var _w = typeof w == "undefined" ? 1.0 : w;
        _v[X]=x;_v[Y]=y,_v[Z]=z,_v[W]=_w;
    } 
    
    //make the vector a trivial base of the 3D space
    //int c = componenet determin which component the base works on
    this.base = function(c) 
    {
        _v = [0.0,0.0,0.0,0.0];
        _v[c] = 1.0;
    }
    
    this.getC = function(i) {return _v[i];}
    
    this.setC = function(i,n) {return _v[i]=n;}
    this.setX = function(n) {_v[X] = n;}
    this.setY = function(n) {_v[Y] = n;}
    this.setZ = function(n) {_v[Z] = n;}
    
    //copy given vector to itself
    this.copy = function(vector3D)
    {
        for (var i=0;i<_v.length;++i)
        {
            _v[i] = vector3D.getC(i);
        }
    }
    
    //transform a vector with a matrix 3X3 (which an array of 3 vectors)
    this.transform = function(m3D)
    {
        var s = [0.0,0.0,0.0,0.0];
        for (var i=0;i<_v.length;++i)
        {
            s[i] = (_v[X]*m3D[X].getC(i))+
                   (_v[Y]*m3D[Y].getC(i))+
                   (_v[Z]*m3D[Z].getC(i))+
                   (_v[W]*m3D[W].getC(i));
        }
        _this.reset(s[X],s[Y],s[Z],s[W]);
    }
    
    //euclidean distance between this and given vector
    this.distance = function(vector3D)
    {
        var s = 0.0;
        var c = 0.0;
        for (var i=0;i<_v.length;++i)
        {
            c = (_v[i]-vector3D.getC(i));
            s += (c*c);
        }
        return Math.sqrt(s);
    }   
    
    this.print = function()
    {
        var str = "";
        for (var i=0;i<_v.length;++i)
        {
            str += _v[i]+" ";
        }
        return str;
    }
    
    
}

///////////////////////////////////////////////////////////////////////////////
// Matrix 3D object
//////////////////////////////////////////////////////////////////////////////
var Matrix3D = function()
{
    var _this = this;
    var _m = [null,null,null,null];
    var N = 4;

    var init = function()
    {
        for (var i=0;i<N;++i) {_m[i] = new Vector3D();}
    }
    
    this.identity = function()
    {
        for (var i=0;i<N;++i) {_m[i].base(i);}
    }
    
    this.getMat = function() {return _m;}
    
    this.getR = function(i) {return _m[i];}
    this.getC = function(i,j) {return _m[i].getC[j];}
    
    this.setR = function(i,vector3D) {_m[i].copy(vector3D);}
    this.setC = function(i,j,value) {_m[i].setC(j,value);}
    
    this.copy = function(matrix3D)
    {
        for (var i=0;i<N;++i)
        {
            _m[i].copy(matrix3D.getR(i));
        }
    }
    
    //this X given matrix   the result updates this matrix
    this.leftMult = function(matrix3D)
    {
        var s = new Matrix3D();
        for (var i=0;i<N;++i)
        {
            s.setR(i,_m[i]);
            s.getR(i).transform(matrix3D.getMat());
        }
        _this.copy(s);
    }
    
    //given matrix x this   the result updates this matrix
    this.rightMult = function(matrix3D)
    {
        var s = new Matrix3D();
        for (var i=0;i<N;++i)
        {
            s.setR(i,matrix3D.getR(i));
            s.getR(i).transform(_m);
        }
        _this.copy(s);
    }
    
    this.print = function()
    {
        var str = "";
        var nl = "\n";
        for (var i=0;i<_m.length;++i)
        {
         str += _m[i].print()+nl;
        }
        return str;
    }
    
    init(); //init the matrix
}

//////////////////////////////////////////////////////////////////////////////
// Matrix 3D Multiplication Rotation and Translation
///////////////////////////////////////////////////////////////////////////////
var M3DM = function()
{
    var _m = new Matrix3D();
    _m.identity();
    
    //Rotate X : angle O in radians
    this.rX = function(O) //O = tetha
    {
        var rotX = new Matrix3D();
        rotX.identity();
        var c = Math.cos(O);
        var s = Math.sin(O);
        
        rotX.setC(1, 1, c);
        rotX.setC(1,2, -s);
        rotX.setC(2,1, s);
        rotX.setC(2,2, c);
        
        _m.rightMult(rotX);
    }
    
    //Rotate Y : angle O in radians
    this.rY = function(O) //O = tetha
    {
        var rotY = new Matrix3D();
        rotY.identity();
        var c = Math.cos(O);
        var s = Math.sin(O);
        
        rotY.setC(0, 0, c);
        rotY.setC(0,2, -s);
        rotY.setC(2,0, s);
        rotY.setC(2,2, c);
        
        _m.rightMult(rotY);
    }
    
    //Rotate Z : angle O in radians
    this.rZ = function(O) //O = tetha
    {
        var rotZ = new Matrix3D();
        rotZ.identity();
        var c = Math.cos(O);
        var s = Math.sin(O);
        
        rotZ.setC(0, 0, c);
        rotZ.setC(0,1, -s);
        rotZ.setC(1,0, s);
        rotZ.setC(1,1, c);
        
        _m.rightMult(rotZ);
    }
    
    this.trans = function(vector3D)
    {
        var t = new Matrix3D();
        t.identity();
        
        for (var i=0;i<3;++i) {t.setC(3,i, vector3D.getC(i));}
        
        _m.rightMult(t);
    }
    
    this.scale = function(vector3D)
    {
        var s = new Matrix3D();
        s.identity();
        
        for (var i=0;i<3;++i) {s.setC(i,i, vector3D.getC(i));}
        
        _m.rightMult(s);
    }
    
    this.getMat = function() {return _m.getMat();}
}



var point3D = function(focalLenght,width,height)
{
    var __point = this;
    var _d = null;
    var _fl = focalLenght;
    var _scale = 0;
    var _cx = width/2;
    var _cy = height/2;
    var _n2Dp = null;
    this.OUT = 'ooc'; //out of camera

    this.get2D = function() 
    {
        //vz - virtual z axis
        if (_scale<=0) {return {x:0,y:10,vz:__point.OUT}}; 
        var dx = _n2Dp.x*_scale+_cx;
        var dy = _n2Dp.y*_scale+_cy;

        return {x:dx,y:dy,vz:_d.z};
    }
    this.scale = function() {return __point._scale;}
    this.setPoint = function(x,y,z)
    {
        _d = {x:x,y:y,z:z};
        _scale = _fl / (_d.z+_fl);
        _n2Dp = {x:_d.x,y:_d.y,z:_scale}; //normlized 2d Point
    }
    
    this.moveTo = function(x,y,z) {__point.setPoint(x, y, z);}    
}


///////////////////////////////////////////////////////////////////////////////
// Scene 3D object
// color : a objct with rgb values i.e {r:255,g:128,b:12}
///////////////////////////////////////////////////////////////////////////////
var Scene3D = function(context,width,height,focalLength,color)
{
    var __base = this;
    var _fl = focalLength;
    var _c = context;
    var _w = width;
    var _h = height;
    var _pointMat = {'0':[0,0,0]};
    var _clr = typeof color == "undefined" ? "0,0,0" : (color.r+","+color.g+","+color.b);
    //inner object point3D
    var _p = new point3D(_fl,_w,_h);
    var _seg_hide = true;

    var transform = function(points3D,matrix)
    {
        var v = new Vector3D();
        var points2D = [];
        var p = null;
        for (var i=0;i<points3D.length;i=i+3)
        {
            v.reset(points3D[i],points3D[i+1],points3D[i+2]);
            //console.log(v.print());
            v.transform(matrix.getMat());
            //console.log(v.print());
            _p.setPoint(v.getC(0), v.getC(1), v.getC(2));
            p = _p.get2D();
            if (p.vz!=_p.OUT && p.vz<_fl) //if not behind the camera and in the focus length
            {
                points2D.push(p);
            }
        }
        return points2D;
    }
    
    var transformCollection = function(collection,matrix)
    {
        var collection2D = {};
        var trans = [];
        for (var k in collection)
        {
            trans = transform(collection[k],matrix);
            if (trans.length>0) {collection2D[k] = trans;}
        }
        return collection2D;
    }

    var fillCirc = function(x,y,r)
    {
//        _c.save();
//        _c.beginPath();
//        _c.arc(x,y,r,0,Math.PI*2,false);
//        _c.stroke();
//        _c.restore();
    }

    this.render = function(angleX,angleY,mx,my,mz,scale)
    {
        var m = new M3DM();
        m.rX(angleX);
        m.rY(angleY);
        m.trans(new Vector3D([mx,my,mz]));
        m.scale(new Vector3D([scale,scale,scale]));
        
        var p2d = transform(__base._pointMat,m);
        var n=0;
        _c.strokeStyle = "rgba("+_clr+",1)";
       _c.beginPath();
        for (var i=0;i<p2d.length;i++)
        {
                
               if (i % 3 === 0 & i+1<p2d.length & _seg_hide)
               {
                 _c.moveTo(p2d[i].x, p2d[i].y);
               }
               else
               {
                   _c.lineTo(p2d[i].x, p2d[i].y);
               }
                
        }
        _c.stroke();
        
    }
    
    this.setPoints = function(pointMat) 
    {
        var c = [];
        for (var k in pointMat)
        {
            c = c.concat(pointMat[k]);
        }
        __base._pointMat = c;
    }
    
}

//////////////////////////////////////////////////////////////////////////////
// Engine
/////////////////////////////////////////////////////////////////////////////
var Engine = function(element_id)
{
    var _canvas = document.getElementById(element_id);
    var _c2D = _canvas.getContext("2d");
    var _this = this;
    var _padding = 50;
    var _win_sz = {w:window.innerWidth-_padding,h:window.innerHeight-_padding};
    var _focalLength = 1000;
    var _scenes = {};
    var _factor = {x:1,y:1};
    var _move = {x:0,y:0,z:0};
    var _scale = 1;
    var _shapes = new Shapes();
    var _framerate =0;
    var _frameCount = 0;
    var _scene_index = 0;
    
    this.framerate = function()
    {
        _framerate = _frameCount;
        _frameCount = 0;
        //console.log(_framerate);
    }
    
    this.printFramerate = function(topx,topy)
    {
        _c2D.fillStyle = "#FFFFFF";
        _c2D.fillRect(topx, topy,20,20);
        _c2D.fillStyle = "#000000";
        _c2D.font = "16px Arial";
        _c2D.textBaseline = 'top';
        _c2D.fillText(_framerate,topx+2,topy+2);
         
    }
    
    
    this.init = function()
    {
        window.setInterval(function() {_this.framerate();}, 1000);
        _c2D.canvas.width = _win_sz.w;
        _c2D.canvas.height = _win_sz.h;
        var o = new Scene3D(_c2D, _win_sz.w,_win_sz.h, _focalLength,{r:255,g:0,b:0});
        o.setPoints(_shapes.Origin(100));
        
        var g = new Scene3D(_c2D, _win_sz.w,_win_sz.h, _focalLength,{r:128,g:128,b:128});
        g.setPoints(_shapes.Grid(_focalLength,20, 0));
        
        _scenes.o = o;
        _scenes.g = g;
        
        window.onmousemove = function(event)
        {
            _factor.y = (((_win_sz.h/2)-event.pageY)*Math.PI)/_win_sz.h;
            _factor.x = (((_win_sz.w/2)-event.pageX)*Math.PI)/_win_sz.w;
        }
        
        window.onkeydown = function(event)
        {
            var code = event.keyCode;
            var md = 10;
            var sd = 1;
            switch(code)
            {
                case 37 :_move.x+=md;break; //left
                case 38 :_move.z-=md;break; //up
                case 39 :_move.x-=md;break; //right
                case 40 :_move.z+=md;break; //down
                case 33 :_scale+=sd;break; //pgUP
                case 34 :_scale-=sd;break; //pgDwn
                case 36 :_scale=1; //home
                          _move.x=0;
                          _move.y=0;
                          _move.z=0;
                    break; 
                    
            }
        }
        
        window.onresize = function(event)
        {
            _win_sz = {w:window.innerWidth-_padding,h:window.innerHeight-_padding};
            _c2D.canvas.width = _win_sz.w;
            _c2D.canvas.height = _win_sz.h;
        }
    }
    
    this.addScene = function(param_object)
    {
        var s = new Scene3D(_c2D, _win_sz.w,_win_sz.h, _focalLength);
        s.setPoints(_shapes.setParam(param_object));
        _scenes["s"]=s;//+_scene_index] = s;
        return _scene_index++;
    }
    
    this.clearScene = function(index)
    {
        if (typeof _scenes["s"+index] == 'undefined') {return;}
        delete _scenes["s"+index];
    }
    
    this.render = function()
    {
        ++_frameCount; //counts the number of frames
        _c2D.clearRect(0, 0, _win_sz.w, _win_sz.h);
        for (var scene in _scenes)
        {
            _scenes[scene].render(_factor.y,_factor.x,_move.x,_move.y,_move.z,_scale);
        }
        _this.printFramerate(0,5);
    }
    
    this.getRequestFrame = function()
    {
        return window.requestAnimationFrame  ||    
               window.webkitRequestAnimationFrame ||    
               window.mozRequestAnimationFrame ||    
               window.oRequestAnimationFrame  ||    
               window.msRequestAnimationFrame  ||    
               function(callback){   
                    window.setTimeout(callback, 1000 / 60);   
               }; 
    }
  
    
    this.animate = function()
    {
        (_this.getRequestFrame())(_this.animate);
        _this.render();
    }
    
    _this.init();
    _this.animate();
    //_this.render();
    
}
