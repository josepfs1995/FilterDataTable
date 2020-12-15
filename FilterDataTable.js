class FilterDataTable{
	constructor(dataTable, props){
		this._props = props || {};
		this._props.formatFilter = this._props.formatFilter || {};
		this.mouseInParent = false;
		this._dataTable = dataTable; 
		this._labelFilterBy = "Filtro: ";
		this._labelSearchBy = "Buscar: ";
		this._filter = [];
		var generateGuid = function(){
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
      .replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
		}
		this.id = generateGuid();
		this._addFilterHeader();
		this._addEventBody();

		if(!this._anyMethodOnFilter())
			console.warn("Por favor asegurate que el metodo onFilter sea function");
	}
	_addEventBody(){
		var instance = this;
		$("body").on("click", function(){ 
			if(!instance.mouseInParent)
				instance._onDestroy();
		});
	}
	setlabelFilterBy(name){
		this._labelFilterBy = name;
	}
	getlabelFilterBy(){
		return this._labelFilterBy;
	}
	setlabelSearchBy(name){
		this._labelSearchBy = name;
	}
	getlabelSearchBy(){
		return this._labelSearchBy;
	}
	_getInstance(){
		return this;
	};
	_getHeader(){
		return this._dataTable.columns().header();
	}
	_containsInput(element){
		return $(element).find("input").length <= 0;
	}
	_addFilterHeader(){
		var heads = this._getHeader();
		var instance = this;
		
		var createFilterSpan = function(property, index){
			var span = document.createElement("span");
			span.className = "fas fa-filter";
			span.style.cursor = "pointer";
			span.style.float = "right";
			var formatFilter = instance._props.formatFilter.firstOrDefault(x=>x.headerIndex == index);
			if(formatFilter !== null){
				span.setAttribute("data-type", instance._getTypeFilter(formatFilter.type));
			}
			else{
				span.setAttribute("data-type", instance._getTypeFilter("text"));
			}
			span.onmouseover = function(){ instance._onMouseOverDiv();};
			span.onmouseout = function(){ instance._onMouseOutDiv();};
			span.onclick = function(){ instance._addToolTip(span, property); };
			return span;
		}
		
		$.each(heads, function(index, item){
			if(instance._containsInput(item)){
				item.style.width = "500px"
				var property = item.getAttribute("data-header") || index.toString();
				$(item).append(createFilterSpan(property, index));
			}
		});
		return this._getHeader();
	};
	_addToolTip(elemento, property){
		this._onDestroy();
		this.mouseInParent = true;
		var div = document.createElement("DIV");
		div.style.maxHeight = "300px";
		div.style.overflow = "auto";
		div.style.position = "relative";
		div.style.maxWidth = "180px";
		div.className = "pt-4 pb-4";
		div.style.border = "1px solid #ccc;";
		div.style.backgroundColor = "#f5f5f5";
		div.style.boxShadow = "0 5px 10px rgba(0,0,0,.2)";
		div.setAttribute("data-header", property);
		div.id = this.id;
		var container = $("div[data-container=true]") || $("body");
		container.append(div);
		div.style.top = `${($(elemento).offset().top - $(div).offset().top) + elemento.offsetHeight}px`;
		div.style.left = `${$(elemento).offset().left - 90}px`;
		
		var type = elemento.getAttribute("data-type");
		$(div).append(this._createSelectWithOptions());
		$(div).append(this._createText(type));
		$(div).append(this._createButton());
		this._setValues(property);
		event.stopPropagation();
	};
	_createSelectWithOptions(){
		var instance = this;
		var div = document.createElement("DIV");
		div.className = "col-md-12";
		div.onmouseover = function(){ instance._onMouseOverDiv();};
		div.onmouseout = function(){ instance._onMouseOutDiv();};
		//Creamos Label
		var label = document.createElement("LABEL");
		label.innerText = this.getlabelFilterBy();
		label.onmouseover = function(){ instance._onMouseOverDiv();};
		label.onmouseout = function(){ instance._onMouseOutDiv();};
		$(div).append(label);
		
		//Creamos select con opciones
		var div2 = document.createElement("DIV");
		div2.onmouseover = function(){ instance._onMouseOverDiv();};
		div2.onmouseout = function(){ instance._onMouseOutDiv();};

		var select = document.createElement("SELECT");
		select.className = "form-control";
		select.name = "condition";
		select.onchange = function(){ instance._onChangeSelect(this);};
		select.onmouseover = function(){ instance._onMouseOverDiv();};
		select.onmouseout = function(){ instance._onMouseOutDiv();};

		var option1 = document.createElement("OPTION");
		option1.value = "1";
		option1.innerText = "Igual que:";
		select.appendChild(option1);

		var option2 = document.createElement("OPTION");
		option2.value = "2";
		option2.innerText = "Contiene que:";
		select.appendChild(option2);

		var option3 = document.createElement("OPTION");
		option3.value = "3";
		option3.innerText = "Mayor que:";
		select.appendChild(option3);

		var option4 = document.createElement("OPTION");
		option4.value = "4";
		option4.innerText = "Menor que:";
		select.appendChild(option4);

		$(div2).append(select);
		$(div).append(div2);

		return div;
	}
	_createText(type){
		var instance = this;
		var div = document.createElement("DIV");
		div.className = "col-md-12";
		div.onmouseover = function(){ instance._onMouseOverDiv();};
		div.onmouseout = function(){ instance._onMouseOutDiv();};
		//Creamos input
		var div2 = document.createElement("DIV");
		div2.className = "mt-3";
		div2.onmouseover = function(){ instance._onMouseOverDiv();};
		div2.onmouseout = function(){ instance._onMouseOutDiv();};

		var input = document.createElement("INPUT");
		input.setAttribute("type", type);
		input.className = "form-control";
		input.name= "value";
		if(type==="date"){
			input.onkeyup =  function(){ return false;};
			input.onchange =  function(){ instance._onKeyUpSelect(this);};
		}else{
			input.onkeyup =  function(){ instance._onKeyUpSelect(this);};
		}
		input.onmouseover = function(){ instance._onMouseOverDiv();};
		input.onmouseout = function(){ instance._onMouseOutDiv();};
		input.setAttribute("placeholder", this.getlabelSearchBy());

		$(div2).append(input);
		$(div).append(div2);
		return div;
	}
	_createButton(){
		var instance = this;
		var div = document.createElement("DIV");
		div.className = "col-md-12 mt-3 btn-group btn-group-toggle";
		div.onmouseover = function(){ instance._onMouseOverDiv();};
		div.onmouseout = function(){ instance._onMouseOutDiv();};
		var buttonFiltrar = document.createElement("BUTTON");
		buttonFiltrar.setAttribute("type", "button");
		buttonFiltrar.className = "btn btn-sm  btn-primary";
		buttonFiltrar.innerHTML = "Filtrar";
		buttonFiltrar.onclick =  function(){ instance._filtrar(this);};
		buttonFiltrar.onmouseover = function(){ instance._onMouseOverDiv();};
		buttonFiltrar.onmouseout = function(){ instance._onMouseOutDiv();};
		$(div).append(buttonFiltrar);
		
		var buttonLimpiar = document.createElement("BUTTON");
		buttonLimpiar.setAttribute("type", "button");
		buttonLimpiar.className = "btn btn-sm  btn-outline-secondary";
		buttonLimpiar.innerHTML = "Limpiar Filtros";
		buttonLimpiar.onclick =  function(){ instance._limpiarFiltro(this);};
		buttonLimpiar.onmouseover = function(){ instance._onMouseOverDiv();};
		buttonLimpiar.onmouseout = function(){ instance._onMouseOutDiv();};
		//input.setAttribute("placeholder", this.getlabelSearchBy());

		$(div).append(buttonLimpiar);
		return div;
	}
	_onChangeSelect(element){
		var parentDiv = $(element).closest("div[data-header]");
		var property = parentDiv.attr("data-header");
		if(!this._filter.any(x=>x.id === property)){
			this._filter.push({ id: property, filter: { condition: element.value, value: "" }});
		}
		else{
			this._filter.firstOrDefault(x=>x.id === property).filter.condition = element.value;
		}
	}
	_onKeyUpSelect(element){
		var parentDiv = $(element).closest("div[data-header]");
		var property = parentDiv.attr("data-header");
		if(!this._filter.any(x=>x.id === property)){
			this._filter.push({ id: property, filter: { condition: "1", value: element.value }});
		}
		else{
			this._filter.firstOrDefault(x=>x.id === property).filter.value = element.value;
		}
	}
	_filtrar(element){
		var parentDiv = $(element).closest("div[data-header]");
		if(this._anyMethodOnFilter()){
			return this._props.onFilter(this.getFilter());
		}
		else console.error("No existe metodo onFilter");
	}
	_limpiarFiltro(element){
		var parentDiv = $(element).closest("div[data-header]");
		var property = parentDiv.attr("data-header");
		var filtro = this._filter.firstOrDefault(x=>x.id === property);
		this._filter.splice(this._filter.indexOf(filtro), 1);

		this._onDestroy();
	}
	_onDestroy(){
		$("#" + this.id).remove();
	}
  _onMouseOverDiv() {
    this.mouseInParent = true;
  };
  _onMouseOutDiv() {
    this.mouseInParent = false;
	};
	_anyMethodOnFilter(){
		return typeof this._props.onFilter === "function";
	}
	_setValues(property){
		var filter = this.getFilter().firstOrDefault(x=>x.id === property);
		if(filter !== null){
			$("#"+ this.id).find("select[name=condition]").val(filter.filter.condition);
			$("#"+ this.id).find("input[name=value]").val(filter.filter.value);
		}
	}
	getFilter(){
		return this._filter;
	};
	_getTypeFilter(type){
		switch(type.toLowerCase()){
			case 'date': return 'date';
			case 'text': return 'text';
			default: throw Error("No existe el tipo "+ type + "en los filtros");
		}
	}
};
