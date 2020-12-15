# FilterDataTable

Agregar filtrado a DataTable con opciones.

# Pasos a seguir

table: Instancia de DataTable()
onFilter: Evento para invocar cuando se le da filtrar

```
var test = new FilterDataTable(table, {
	onFilter:function(filtros){
		console.log(filtros);
		alert(filtros);
	}
});
```

# Tipo de Filtrado

Por el momento se manejan dos tipos de filtros "date" y "text"
Valor por defecto: Text


```
var test = new FilterDataTable(tablita, {
	onFilter:function(filtros){
		console.log(filtros);
		alert(filtros);
	},
	formatFilter: [{
		headerIndex: 5,
		type:"date"
	}]
});
```

Opcional:
PropertyName en la cabecera.

```
<th data-header="orderId">Order ID</th>

<th data-header="country">Country</th>
```

Agregar el atributo  data-container al DIV padre, por defecto es Body

```
 data-container="true"
```
