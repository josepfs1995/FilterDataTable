# FilterDataTable

Agregar filtrado a DataTable con opciones.

# Pasos a seguir

PropertyName en la cabecera.

```
<th data-header="orderId">Order ID</th>
													<th data-header="country">Country</th>
```

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