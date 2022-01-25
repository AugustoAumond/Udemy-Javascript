class CalcController {

constructor() {
    this._audio = new Audio ('click.mp3');
    this._audioOnOff = false ;
    this._lastOperator = "";
    this._lastNumber = "";
    this._operation = [];
    this._displayCalcEl = document.querySelector("#display")
    this._dateEl = document.querySelector("#data")
    this._timeEl = document.querySelector("#hora")      
    this._currentDate; 
    this._Locale = "pt-BR";
    this.initialize();  
    this.initButtonsEvents();   
    this.addKeyboards()
    }

    // Copiar números de fora para a calculadora
    pastefronClipboard(){
        document.addEventListener('paste', e=>{

        let text = e.clipboardData.getData('text');

        this.displayCalc = parseFloat(text);

        });
        
    }

    // Copiar o número da calculadora para outro arquivo
    copyToClipboard (){
        let input = document.createElement('input')

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand('Copy');

        input.remove();
    }

    // Informações ao inicializar a calculadora
    initialize(){     

    this.setDisplayDateTime();

    let interval = setInterval(() => {
    this.setDisplayDateTime();
    },1000);

    this.setlastNumbertoDisplay();
    this.pastefronClipboard();

    // Selecionando o evento de dublo click para adicionar o audio
    document.querySelectorAll('.btn-ac').forEach(btn =>{
        btn.addEventListener('dblclick', e =>{
                this.toggleAudio();
            })
        })
    };

    // Verificando som
    toggleAudio(){    

       this._audioOnOff = !this._audioOnOff;
       console.log (this._audioOnOff);    
    }

    // Tocando o audio
    playAudio(){   
        if (this._audioOnOff){   
        this._audio.currentTime = 0;
        this._audio.play();  
        }; 
    }


    // Eventos de teclado
    addKeyboards(){
        document.addEventListener("keyup", e => {

        this.playAudio();

            switch (e.key){
                case 'Escape': this.clearAll();
                break;
    
                case 'Backspace': this.clearEntry();
                
                case '%':       
                case '/':              
                case '*': 
                case '-': 
                case '+': 
                this.addOperation(e.key);
                break;
    
                case '=':
                case 'Enter': this.calc();
                break;
    
                case '.':
                case ',': this.addDot(".");
                break;
    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                this.addOperation(parseInt(e.key));
                    break;

                case 'c':
                    if (e.ctrlKey) this.copyToClipboard();
                    break;
    
            }
        })
    }

    // reconhecimento dos botões
    addEventListenerAll(element, events, fn){
        events.split(" ").forEach(event =>{
            element.addEventListener(event, fn, false);
        });      
    }

    // Zerar a calculadora
    clearAll (){
        this._operation = [];
        this._lastNumber = "";
        this._lastOperator = "";
        this.setlastNumbertoDisplay();
    }

    // Cancelar última entrada
    clearEntry (){
       this._operation.pop();
       this.setlastNumbertoDisplay();
     }

    // Definir erros (dados não tratados)
    setError (){
         this.displayCalc = "Error";
     }

    // Pegar último valor do array
    getLastOperation(){
       return this._operation[this._operation.length -1];
     }

    // Substituir o último valor do array
    setLastOperation(value){
        this._operation[this._operation.length -1] = value;        
     }
    
    // Adicionar o operador
    pushOperator(value)
        {this._operation.push(value);
            if (this._operation.length > 3){
            this.calc();                  
            }
        } 
    
    // Realizar a conta matematica
    getResult(){
        try{
            return eval(this._operation.join(""));}
            catch(e){
                setTimeout(() => {
                   this.setError(); 
                }, 1);              
            }
        }

    // Tratando os calculos
    calc(){
        let last = "";
        this._lastOperator = this.getLastItem();
               

        if (this._operation.length < 3){
            let firstNumber = this._operation[0];
            this._operation = [firstNumber, this._lastOperator, this._lastNumber];
        }

        if(this._operation.length > 3){
            last = this._operation.pop();
            this._lastNumber = this.getResult();
            
        }        
     
           else if  (this._operation.length == 3){
            this._lastNumber = this.getLastItem(false);
        }           

         let result = this.getResult();
        if (last == "%"){
                this.result /= 100;
                this._operation = [this.result];    
            }

        else {
            this._operation = [result];
             
        if (last) this._operation.push(last);
            }      
            this.setlastNumbertoDisplay();
        }

    // Validando operador   
    isOperator(value){  
       return (["+", "-", "%", "/", "*"].indexOf(value) > -1);
    }
    
    // Guardando o último valor
    getLastItem(isOperator = true){
        let lastItem;
       for (let i = this._operation.length -1; i >= 0; i--){  
           if (this.isOperator(this._operation[i]) == isOperator){
                lastItem = this._operation[i]; break;} 
        } 
            if(!lastItem){
                lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
            }
        return lastItem;
    }

    // Adicionando último valor ao display
    setlastNumbertoDisplay(){
        let lastNumber = this.getLastItem(false);
        if (!lastNumber){lastNumber = 0;}
        this.displayCalc = lastNumber;     
    }

    //  Adicionando valores do calculo
    addOperation(value){
    if (isNaN(this.getLastOperation())){ 
        if (this.isOperator(value)){this.setLastOperation(value);     
        }
        else {this.pushOperator(value);
            this.setlastNumbertoDisplay();
            }
    } 
    else {  
        if (this.isOperator(value)){
            this.pushOperator(value);
    }
            
             else {                 
                let newValue = this.getLastOperation().toString() + value.toString(); 
            this.setLastOperation(newValue);
           this.setlastNumbertoDisplay(value);
        }   
    }
}

    // Validando ponto
    addDot (){
        let lastOperation = this.getLastOperation();
        if (typeof lastOperation === "string" && lastOperation.split("").indexOf(".") > -1) return;
        if (this.isOperator(lastOperation) || !lastOperation){
            this.pushOperator("0.");
        } else { 
            this.setLastOperation(lastOperation.toString() + ".");
        }

    }

    // Switch dos eventos de Mouse
    execBtn(value){

        this.playAudio();

        switch (value){
            case 'ac': this.clearAll();
            break;

            case 'ce': this.clearEntry();
            break;

            case 'porcento': this.addOperation("%");
            break;

            case 'divisao': this.addOperation("/");
            break;

            case 'multiplicacao': this.addOperation("*");
            break;

            case 'subtracao': this.addOperation("-");
            break;

            case 'soma': this.addOperation('+');
            break;

            case 'igual': this.calc();
            break;

            case 'ponto': this.addDot(".");
            break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
           this.addOperation(parseInt(value));
                break;

            default: 
            this.setError();
            break;
        }
    }

    // Adicionando eventos de mouse
    initButtonsEvents(){

    let buttons = document.querySelectorAll("#buttons > g, #parts > g");
        buttons.forEach((btn, index) =>{
            this.addEventListenerAll(btn, "click drag", e => {
                let textBtn = btn.className.baseVal.replace("btn-", ""); 
                this.execBtn(textBtn);
        });   
            
        this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
            btn.style.cursor = "pointer";
            });
        });
    }

    // Adicionando Data e Hora
    setDisplayDateTime(){
    this.displayDate = this.currentDate.toLocaleDateString(this._Locale);
    this.displayTime = this.currentDate.toLocaleTimeString(this._Locale);
    }

    
    get displayDate(){
        return this_dateEl.innerHTML;
    }

    set displayDate(value){
        return this._dateEl.innerHTML = value
    }

    get displayTime(){
        return this._timeEl.innerHTML;
 }

    set displayTime(value){
        return this._timeEl.innerHTML = value;
    }
   
   get displayCalc(){
       return this._displayCalcEl.innerHTML;
   }
    
   set displayCalc(value){
       if (value.toString().length > 10){
           this.setError();
           return false;

       }
       return this._displayCalcEl.innerHTML = value;
   }
  
   get currentDate(){
       return new Date;
   }
   
   set currentDate(value){
      this._currentDate = value;
   }
  
}