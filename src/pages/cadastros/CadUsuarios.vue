<template>
  <q-page class="flex flex-center">
		<h1>Cadastro Usuários</h1>
    <div class="row light divider"></div> 
	 <div class="row">   
	 <div class="col s1"><a id="novoRegistro" href="#" title="Incluir"><i class="material-icons color-site">add_circle_outline</i></a></div> 
	 <div class="col s11"></div> 
	 </div> 	
	   	 <div class="row light"> 
    	if (classBy == "nome") {
    		if (order == "down")
    	 	     <div class="col s5 tit-lista">Nome do usu&aacute;rio<i class="fas fa-arrow-down-short-wide" id="classNome" style="margin-left: 5px; cursor: pointer;"></i></div> 
    		else
    	 	     <div class="col s5 tit-lista">Nome do usu&aacute;rio<i class="fas fa-arrow-up-short-wide" id="classNome" style="margin-left: 5px; cursor: pointer;"></i></div> 
   	 	     <div class="col s4 tit-lista">Grupo<i class="fas fa-arrow-down-short-wide" id="classGrupo" style="margin-left: 5px; cursor: pointer;"></i></div> 
   	 	 
    	}
       	if (classBy == "grupo") {
	 	     <div class="col s5 tit-lista">Nome do usu&aacute;rio<i class="fas fa-arrow-down-short-wide" id="classNome" style="margin-left: 5px; cursor: pointer;"></i></div> 
    		if (order == "down")
    	 	     <div class="col s4 tit-lista">Grupo<i class="fas fa-arrow-down-short-wide" id="classGrupo" style="margin-left: 5px; cursor: pointer;"></i></div> 
    		else
    	 	     <div class="col s4 tit-lista">Grupo<i class="fas fa-arrow-up-short-wide" id="classGrupo" style="margin-left: 5px; cursor: pointer;"></i></div> 
    	}
   	     <div class="col s3"></div> 
   	     </div> 
   	     <div class="row light"><div class="col s12 divider"></div></div> 
            var divRow ='     
            	divRow+='<div id="regRow'+reg.codigo+'" class="row light ativ_line"> 
         	    divRow+='<div id="desc'+reg.codigo+'" class="col s5">'+reg.nome+'</div> 
         	    divRow+='<div class="col s4">'+reg.grupo.descricao+'</div> 
           	    divRow+='<div class="col s3"> 
           	    divRow+='<a class="altReg" id="alt'+reg.codigo+'" href="#" title="Editar"><i class="material-icons color-site">mode_edit</i></a> 
           	    divRow+='<a class="delReg" id="del'+reg.codigo+'" href="#" title="Excluir"><i><img class="delete" /></i></a> 
           	    divRow+='<a class="spwReg" id="spw'+reg.codigo+'" href="#" title="Enviar senha"><i class="material-icons color-site">email</i></a> 
           	    divRow+='<a class="libReg" id="lru'+reg.codigo+'" href="#" title="Liberar rotinas"><i><img class="librotinas" /></i></a> 
           	    divRow+='</div> 
           	    divRow+='</div> 
           	    divRows+=divRow;

   	     <div class="row light"><div class="col s12 divider"></div></div> 
           </q-page>
</template>

<script setup>
//
</script>