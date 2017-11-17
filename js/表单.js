window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
window.IDBCursor = window.IDBCursor || window.webkitIDBCursor || window.msIDBCursor;
var dbName = "Mydata";
var dbVersion = "20171105";
var idb,datatable,data;
//连接数据库
function window_onload(){
	var dbConnect = indexedDB.open(dbName,dbVersion);
	dbConnect.onsuccess = function(e){
		idb = e.target.result;
		console.log(idb);
		datatable = document.getElementById("datatable");
		showAlldata(false);
	}
	dbConnect.onerror = function(e){
		alert("连接数据库失败！");
	}
    dbConnect.onupgradeneeded = function(e){
    	idb = e.target.result;console.log(idb);
    	if(!idb.objectStoreNames.contains('orders2')){
    		var tx = e.target.transaction;//事务处理
    		tx.oncomplete = function(){
    			showAlldata(true);
    		};
    		tx.onabort = function(){
    			console.log("对象仓库创建失败");
    		};
    		var name = 'orders2';
    		var optionalParameters = {
    			keyPath:"id",
    			autoIncrement:true
    		};
    		//创建数据仓库，相当于表
    		var store = idb.createObjectStore(name,optionalParameters);
    		console.log("数据仓库创建成功");
    		var name = "codeIndex";
    		var keyPath = "code";
    		var optionalParameters = {
    			unique:true,
    			multiEntry:false
    		};
    		//创建索引
    		var idx = store.createIndex(name,keyPath,optionalParameters);
    		console.log("index 创建成功");
    	}
    };
};
function tr_onclick(tr,i){
	document.getElementById("tbxCode").value = tr.children.item(0).innerHTML;
	document.getElementById("tbxDate").value = tr.children.item(1).innerHTML;
	document.getElementById("tbxGoodsCode").value = tr.children.item(2).innerHTML;
	document.getElementById("tbxBrandName").value = tr.children.item(3).innerHTML;
	document.getElementById("tbxNum").value = tr.children.item(4).innerHTML;
	document.getElementById("tbxPrice").value = tr.children.item(5).innerHTML;
	document.getElementById("tbxMoney").value = tr.children.item(6).innerHTML;
	document.getElementById("tbxPersonName").value = tr.children.item(7).innerHTML;
	document.getElementById("tbxEmail").value = tr.children.item(8).innerHTML;
	
	document.getElementById("tbxCode").setAttribute("readonly",true);
	document.getElementById("btnAdd").disabled = "disabled";
	document.getElementById("btnUpdate").disabled = "";
	document.getElementById("btnDelete").disabled = "";
}
//展示数据的方法，让增删改查去调用让显示数据
function showData(row,i){
	var tr = document.createElement('tr');
	tr.setAttribute("onclick","tr_onclick(this,"+i+")");
	
	var td1 = document.createElement('td');
	td1.innerHTML = row.code;
	var td2 = document.createElement('td');
	td2.innerHTML = row.date;
	var td3 = document.createElement('td');
	td3.innerHTML = row.goodscode;
	var td4 = document.createElement('td');
	td4.innerHTML = row.brandName;
	var td5 = document.createElement('td');
	td5.innerHTML = row.num;
	var td6 = document.createElement('td');
	td6.innerHTML = row.price;
	var td7 = document.createElement('td');
	td7.innerHTML = parseInt(row.num)*parseFloat(row.price);
	var td8 = document.createElement('td');
	td8.innerHTML = row.personName;
	var td9 = document.createElement('td');
	td9.innerHTML = row.email;
	
	tr.appendChild(td1);
	tr.appendChild(td2);
	tr.appendChild(td3);
	tr.appendChild(td4);
	tr.appendChild(td5);
	tr.appendChild(td6);
	tr.appendChild(td7);
	tr.appendChild(td8);
	tr.appendChild(td9);
	
	datatable.appendChild(tr);
}
//增加数据，然后调用
function btnAdd_onclick(){
	data = new Object();
	data.Code = document.getElementById("tbxCode").value;
	data.Date = document.getElementById("tbxDate").value;
	data.GoodsCode = document.getElementById("tbxGoodsCode").value;
	data.BrandName = document.getElementById("tbxBrandName").value;
	data.Num = document.getElementById("tbxNum").value;
	data.Price = document.getElementById("tbxPrice").value;
	data.PersonName = document.getElementById("tbxPersonName").value;
	data.Email = document.getElementById("tbxEmail").value;
	
	var tx = idb.transaction(['orders2'],"readwrite");
	var chkErrorMsg = "";
	tx.oncomplete = function(){
		if(chkErrorMsg != ""){
			console.log(chkErrorMsg);
			btnClear_onclick();
			alert(chkErrorMsg);
		}else{
			console.log("数据加载成功");
			showAlldata(false);	
//			btnNew_onclick();
		}
	}
	tx.onabort = function(){
		console.log('追加数据失败');
	}
	var store = tx.objectStore('orders2');;
	var idx = store.index('codeIndex');//codeIndex 索引的名字
	var range = IDBKeyRange.only(data.Code);
	var direction = "next";
	var req = idx.openCursor(range,direction);
	req.onsuccess = function(){
		var cursor = this.result;
		if(cursor){
			chkErrorMsg = "输入订单编号已经在数据库中存在";
			return;
		}else{
			var value = {
				code:data.Code,
				date:data.Date,
				goodscode:data.GoodsCode,
				brandName:data.BrandName,
				num:data.Num,
				price:data.Price,
				personName:data.PersonName,
				email:data.Email
			};
			store.put(value);
			console.log(value);
		}
	}
	req.onerror = function(){
		alert("追加数据失败");
	}	
}
//删
function btnDelete_onclick(){
	var tx = idb.transaction(['orders2'],"readwrite");
	tx.oncomplete = function(){
		console.log("删除数据成功");
		showAlldata(false);
//		btnNew_onclick();
	};
	tx.onabort = function(){
		console.log("删除数据失败");
	};
	var store = tx.objectStore('orders2');
	var idx = store.index('codeIndex');
	var range = IDBKeyRange.only(document.getElementById("tbxCode").value);
	var direction = "next";
	var req = idx.openCursor(range,direction);
	req.onsuccess = function(){
		var cursor = this.result;
		if(cursor){
			cursor.delete();
		}
	};
	req.onerror = function(){
		console.log('删除数据失败');
	}
}
//改
function btnUpdate_onclick(){
	data = new Object();
	data.Code = document.getElementById("tbxCode").value;
	data.Date = document.getElementById("tbxDate").value;
	data.GoodsCode = document.getElementById("tbxGoodsCode").value;
	data.BrandName = document.getElementById("tbxBrandName").value;
	data.Num = document.getElementById("tbxNum").value;
	data.Price = document.getElementById("tbxPrice").value;
	data.PersonName = document.getElementById("tbxPersonName").value;
	data.Email = document.getElementById("tbxEmail").value;
	
	var tx = idb.transaction(['orders2'],"readwrite");
	var chkErrorMsg = "";
	tx.oncomplete = function(){
		console.log("修改数据成功");
		showAlldata(false);
	}
	tx.onabort = function(){
		console.log('修改数据失败');
	}
	var store = tx.objectStore('orders2');
	var idx = store.index('codeIndex');//codeIndex 索引的名字
	var range = IDBKeyRange.only(data.Code);
	var direction = "next";
	var req = idx.openCursor(range,direction);
	req.onsuccess = function(){
		var cursor = this.result;
		if(cursor){
			var value = {
				id:cursor.value.id,
				code:data.Code,
				date:data.Date,
				goodscode:data.GoodsCode,
				brandName:data.BrandName,
				num:data.Num,
				price:data.Price,
				personName:data.PersonName,
				email:data.Email
			};
			cursor.update(value);
		}
	}
	req.onerror = function(){
		alert("追加数据失败");
	}	
}
//查，开启事务，查找数据，调用显示的方法showData来显示数据
function showAlldata(loadPage){
	if(!loadPage){removeAllData();}//如果事务处理完成就执行显示
	   
    var tx = idb.transaction(['orders2'],"readonly");//开启事务
	var store = tx.objectStore('orders2');
	var range = IDBKeyRange.lowerBound(1);
		
	var direction = "next";
	var req = store.openCursor(range,direction);
		
	var i = 0;
	req.onsuccess = function(){
		var cursor = this.result;
		if(cursor){
			i+=1;
			showData(cursor.value,i);//取出数据，调用展示方法，将数据展现出来
			console.log(cursor.value);
			cursor.continue();
		}
	}
	req.onerror = function(){
		console.log("检索数据失败");
	}
}

//清空显示的数据，不是清空数据库的数据，为的是在每次数据改变时又要重新从数据库中取出数据显示，得把原来显示得重新洗牌
function removeAllData(){
	for(var i = datatable.childNodes.length-1;i>1;i--){
		datatable.removeChild(datatable.childNodes[i]);
	}
}
function btnNew_onclick(){
	//新增数据初始化
	document.getElementById("form1").reset();//表单重置
	document.getElementById("tbxCode").removeAttribute("readonly");
	document.getElementById("btnAdd").disabled ="";
	document.getElementById("btnUpdate").disabled = "disabled";
	document.getElementById("btnDelete").disabled = "disabled";
}

function btnClear_onclick(){
	//表单重置
	//表单重置的方法一
	document.getElementById("tbxDate").value = "";
	document.getElementById("tbxGoodsCode").value = "";
	document.getElementById("tbxBrandName").value = "";
	document.getElementById("tbxNum").value = "0";
	document.getElementById("tbxPrice").value = "请输入有效单价";
	document.getElementById("tbxMoney").value = "￥0.00";
	document.getElementById("tbxPersonName").value = "";
	document.getElementById("tbxEmail").value = "";
    //document.getElementById("form1").reset();//表单重置方法二
}

//价格与数量失去焦点
function tbxNum_onblur(){
	var num,price;
	num = parseInt(document.getElementById("tbxNum").value);
	if(isNaN(num)){
		num = "0";
		return;
	}
}
function tbxPrice_onblur(){
	var num,price;
	num = parseInt(document.getElementById("tbxNum").value);
	price = parseInt(document.getElementById("tbxPrice").value);
	if(isNaN(price)){
		document.getElementById("tbxPrice").value = "请输入有效价格";
		return;
	}
	if(isNaN(num*price)){//不是数字时
			document.getElementById("tbxNum").value = "0";
			document.getElementById("tbxMoney").value = "0";
		}else{//是数字时
			document.getElementById("tbxMoney").value = "￥" + num*price +".00";
	}
}



































