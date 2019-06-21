//密码的正则表达式
export function pwdReg(params){
    let pwdreg = /^[A-Za-z0-9]+$/;

    return pwdreg.test( params );//检测是否满足正则 /返回true /false
}
// 商品条形码正则
export function BarCodeReg( params ){
    let Reg = /\b\d{7,8}\b/gm;

    return Reg.test( params );
}

// 价格正则
export function PriceReg( params ){
    let Reg = /\b\d{1,8}\b/gm;

    return Reg.test( params );
}

//身份证
export function IpNumReg( params ){
    let Reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

    return Reg.test( params );
}

//手机号码
export function PhoneNumReg( params ){
    let Reg = /^1(3|6|7|8)\d{9}$/;//1开头 第二位3、6、7、8 后面直到11位数字

    return Reg.test( params );
}

//座机号码
export function TelNumReg( params ){
    let reg = /0\d{2}-\d{7,8}/; //0开始，跟随2-3个数字 - 加7、8个数字

    return reg.test( params );
}
//邮箱
export function EmailReg( params ){
    let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

    return reg.test( params );
}