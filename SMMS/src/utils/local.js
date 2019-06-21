/* 
  localStorage 本地存储封装
*/

export default{
    save(key,value){//存数据
       window.localStorage.setItem(key , JSON.stringify(value));
    },
    get(key){//取数据
       return JSON.parse(window.localStorage.getItem(key));
    },
    remove(key){//删除指定数据
        window.localStorage.removeItem(key);
    }
}