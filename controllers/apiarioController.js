class apiarioController{

	constructor(formIdCreate, formIdUpdate, tableId){
		this.formEl = document.getElementById(formIdCreate);
		this.formUpdateEl = document.getElementById(formIdUpdate);
		this.tableEl = document.getElementById(tableId);

		this.onSubmit();
		this.onEdit();
	}
	//MÉTODO PARA EDIÇÃO DOS DADOS DO USUÁRIO
	onEdit(){
		document.querySelector("#form-apiario-create").addEventListener("click", e=>{
			this.showPanelCreate();
		});
		this.formUpdateEl.addEventListener("submit", event => {
			event.preventDefault();
			let btn = this.formUpdateEl.querySelector('[type=submit]')
			btn.disabled = true;
			//Cria uma variável para receber os valores atuais do form de edição
			let valores = this.getValues(this.formUpdateEl);            
			//Variável para armazenar o conteúdo do atributo data-trIndex que contém o índice da linha na tabela HTML. Poderia ser a chave primária do registro.
			let index = this.formUpdateEl.dataset.trIndex;
			//Variável para armazenar a linha TR a ser editada
			let tr = this.tableEl.rows[index]
			//Criando objeto antigo para buscar a foto
			let apiarioAntigo = JSON.parse(tr.dataset.apiario);
			//Unificando no objeto result o objeto antigo userOld com os novos dados editados vindos da variável values
			let result = Object.assign({}, apiarioAntigo, valores);      
			console.log("desgraça" + result)
			//Se a função getPhoto() retornar resolve(), entra nesta função
			//Se utilizar o método tradicional com function dá erro no this (referência)
			//Por isso muda-se do formato: function(content){ 
			//para arrow function: (content) => {
			//Acessando e atualizando o atributo data-user da API dataset na linha TR do usuário que está sendo editado.
			tr.dataset.apiario = JSON.stringify(result);
			//Inserindo os novos dados na linha TR editada
			tr.innerHTML = `
			<tr>
				<td>${result._nome}</td>
				<td>${result._especie}</td>
				<td>${result._populacao}</td>
				<td>${result._populacao}</td>
				<td>${result._apicultor}</td>
				<td>
					<button id="btn-edit" class="edit">editar</button>
					<button id="btn-delete" class="delete">exluir</button>
				</td>
			</tr> 
			`;     
			this.addEventsTR(tr); 
			//Após confirmar edição da linha com os dados Habilita o botão de salvar edição, limpa e esconde o form de edição, e mostra o formulário de cadastro
			this.formUpdateEl.reset();
			this.showPanelCreate();
			btn.disabled = false;
			}, (e) => {
				console.error(e);
			}                 
		);
	}
	//MÉTODO PARA CADASTRO DOS DADOS DO USUÁRIO
	onSubmit(){
		//Aguardando o evento de submissão "submit" do formulário
		this.formEl.addEventListener("submit",event => {    
			event.preventDefault();
			//Cria referência para o botão salvar
			let btn = this.formEl.querySelector('[type=submit]')
			//Desabilita o botão salvar
			btn.disabled = true;
			let valores = this.getValues(this.formEl);
			if(!valores){
				btn.disabled = false;
				return false;
			}            
			//O content contém a função de callback em getPhoto(callback)
			this.addline(valores);   
			//Após adicionar a linha com os dados limpa-se o form e habilita o botão salvar
			this.formEl.reset();
			btn.disabled = false;
			//Remova a classe de erro após o envio
			[...this.formEl.elements].forEach(function(field, index){
				//Validação
				//A função indexOf retorna um valor acima -1 caso o field.name exista no vetor ['name','email','password']
				if(['nome','especie','populacao',
					'apicultor','latitude','longitude'].indexOf(field.name) > -1 && !field.value){
					//Adicionar classe CSS com formato de erro
					field.parentElement.classList.remove('has-error');
				}
			});
		}, (e) => {
			console.error(e);
		}
		
		);
	}
	//MÉTODO QUE BUSCA OS DADOS INFORMADOS NO FORMULÁRIO formEl E RETORNA UM OBJETO JSON 
	getValues(formEl){
		//Criação de um objeto JSON vazio com escopo somente dentro da função (let)
		let apiario = {};
		let isValid = true;
		//O ForEach funciona para vetores, por isso ocorre erro
		//Para ajustar deve-se usar o operador spread, que torna um elemento entre cholchetes e ... um vetor
		//Percorre os elementos do formulário e atribui ao objeto JSON todos elementos do formulário 
		
		[...formEl.elements].forEach(function(field, index){

			//Validação
			//A função indexOf retorna um valor acima -1 caso o field.name exista no vetor ['name','email','password']
			if(['nome','especie','populacao',
				'apicultor','latitude','longitude'].indexOf(field.name) > -1 && !field.value){
				field.parentElement.classList.add('has-error');
				//Para a execução caso ocorra erro
				isValid = false;
			}
			//Buscando os dados do formulário
			apiario[field.name] = field.value;
		});

	
	if(!isValid){
		return false;
	}
	return new Apiario(
		apiario.nome,
        apiario.especie,
        apiario.populacao,
        apiario.apicultor,
        apiario.latitude,
        apiario.longitude
	);
	}

	//MÉTODO QUE ADICIONA UMA NOVA LINHA NA TABELA HTML
	addline(dataApiario){ 

		let tr = document.createElement('tr');
		//A função JSON.stringfy serializa um objeto JSON numa string única
		//O objeto seralizado é armazenado na API Dataset. O objeto é armazenado como
		//string num atributo data-user no elemento HTML TR.
		tr.dataset.apiario = JSON.stringify(dataApiario); 
		//A crase ` possibilita criar um template stream, onde pode-se ter quebras de linha
		tr.innerHTML = `
			<tr>
				<td>${dataApiario._nome}</td>
				<td>${dataApiario._especie}</td>
				<td>${dataApiario._populacao}</td>
				<td>${dataApiario._apicultor}</td>
				<td>
					<button id="btn-edit" class="edit">editar</button>
					<button id="btn-delete" class="delete">exluir</button>
				</td>
			</tr> 
		`;     
		//Adiciona um ouvinte nos botões de editar e excluir
		console.log(tr);
		this.addEventsTR(tr);
		this.tableEl.appendChild(tr);
	}

	//MÉTODO QUE ADICIONA FUNCIONALIDADE AOS BOTÕES "Editar" E "Excluir"
	addEventsTR(tr){
		console.log(tr.querySelector(".btn-delete"));
		//Quando clicar no botão de excluir de uma linha específica, esta é removida
		// tr.querySelector(".btn-delete").style.backgroundColor = "red";
		tr.querySelector("#btn-delete").addEventListener("click", () => {
			console.log("AAAAAAAAAAAAAAAAAAA")
			if(confirm("Confirma a exclusão?")){
				//A variável tr se refere a linha que possui o botão Excluir clicado
				tr.remove();
			}
		});
		
		tr.querySelector("#btn-edit").addEventListener('click', e=>{
			
			console.log(JSON.parse(tr.dataset.apiario));
			//Criando uma variável para armazenar o objeto JSON armazenado no atributo data-user da API dataset
			let json = JSON.parse(tr.dataset.apiario);
			//Salva no form de edição um atributo data-trIndex da API dataset com o índice da linha na tabela. Poderia ser a chave primária do registro
			this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;
			//Laço de repetição para percorrer os itens do JSON e comparar com os atributos name dos inputs do formulário
			for(let nome in json){                
				//Cria referência para o campo no formulário equivalente ao name (propriedade) do ojetso JSON    
				//O replace é utilizado para a seleçao correta, uma vez que o _ só existe no JSON, e não no name dos inputs do form
				let field = this.formUpdateEl.querySelector("[name=" + nome.replace("_","") + "]");
				console.log(nome, field);               
				//Se achou um campo correspondente no form, atribue no value do campo a propriedade JSON, porém não são todos campos que tem value
				//Cada tipo de campo deve ser tratado de uma forma
				if(field){
					field.value = json[nome];              
				}                
			}
			//Chamando método para mostra form de edição
			this.showPanelUpdate();

		});
	}
	//MÉTODO QUE MOSTRA O FORM DE CADASTRO E OCULTA O FORM DE EDIÇÃO
	showPanelCreate(){
	 //Ocultando formulário de edição e mostrando formulário de cadastro
	 document.querySelector("#form-apiario-create").style.display = "block";
	 document.querySelector("#form-apiario-update").style.display = "none";
	}
	//MÉTODO QUE MOSTRA O FORM DE EDIÇÃO E OCULTA O FORM DE CADASTRO
	showPanelUpdate(){
		//Ocultando formulário de cadastro e mostrando formulário de edição
		document.querySelector("#form-apiario-create").style.display = "none";
		document.querySelector("#form-apiario-update").style.display = "block";   
	}	
} 