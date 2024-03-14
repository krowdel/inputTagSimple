class TagTransl {
    constructor(lang) {
        switch(lang) {
            case 'pl': return this.pl(); break;
            case 'en': return this.en(); break;
            case 'ru': return this.ru(); break;
            case 'de': return this.de(); break;
            case 'hu': return this.hu(); break;
            default: return this.pl(); break;
        }
    }
    pl(){
        const obj={
            alertTitle: 'Uwaga',
            errorDuble: 'Te dane już wcześniej zostały wprowadzone',
            errorEmail: 'To nie jest poprawny mail',
            errorText: 'Dopuszczlane są tylko liter',
            errorDefu: 'Tylko litery i cyfry',
            errorLimit: 'Przekroczono limit wprowadzonych danych',
            placeholder: 'zacznij pisać, spacja dodaje wpis'
        }
        return obj;
    }
    en(){
        const obj={
            alertTitle: 'Caution',
            errorDuble: 'This data has already been entered before',
            errorEmail: 'This is not a valid email',
            errorText: 'Only letters are valid',
            errorDefu: 'Only letters and numbers',
            errorLimit: 'Input limit exceeded',
            placeholder: 'start writing, space adds an entry'
        }
        return obj;
    }
    de(){
        const obj={
            alertTitle: 'Vorsicht',
            errorDuble: 'Diese Daten wurden schon einmal eingegeben',
            errorEmail: 'Dies ist keine gültige E-Mail',
            errorText: 'Nur Buchstaben sind gültig',
            errorDefu: 'Nur Buchstaben und Zahlen',
            errorLimit: 'Eingabegrenze überschritten',
            placeholder: 'fang an zu schreiben, Leerzeichen fügt einen Eintrag hinzu'
        }
        return obj;
    }
    ru(){
        const obj={
            alertTitle: 'Осторожность',
            errorDuble: 'Эти данные уже были введены ранее',
            errorEmail: 'Это недействительный адрес электронной почты',
            errorText: 'Действительны только буквы',
            errorDefu: 'Только буквы и цифры',
            errorLimit: 'Превышен входной лимит',
            placeholder: 'начать писать, пробел добавляет запись'
        }
        return obj;
    }
    hu(){
        const obj={
            alertTitle: 'Vigyázat',
            errorDuble: 'Ezeket az adatokat már korábban megadták',
            errorEmail: 'Ez nem érvényes e-mail',
            errorText: 'Csak a betűk érvényesek',
            errorDefu: 'Csak betűk és számok',
            errorLimit: 'Túllépte a bemeneti korlátot',
            placeholder: 'kezdj el írni, szóköz bejegyzést ad hozzá'
        }
        return obj;
    }
}
/* system dzialajacy analogicznie jak tags
do jego działania wymagane znacznik div (field) wewnątrz którego znajdzie się jeden input który chcemy podmienić. */

class Tags {
    constructor( 
        config = {
            inputName: "email", // nazwa inputa który chcemy podmienić
            separate: ', ',     // seprator danych do wysłania 
            type: "default",    // typ walidacji mail, text 
            limit: 512          // całkowity limit dlugosci stringa O lub null brak limitu  
        }, lang='pl') 
    {

        this.config = config;
        if (!this.config.separate) { this.config.separate =', '; }
        if (!this.config.type)     { this.config.type ='default'; }
        if (!this.config.limit)    { this.config.limit =0; }
        this.alert = null;
        this.trans= new TagTransl(lang);
        this.createArea();
        this.areaTags = document.querySelector('.field .areaTags.'+this.config.inputName);
        this.input = document.querySelector('[data-empty=' + this.config.inputName + ']');
        this.hidde = document.querySelector('input[name='+this.config.inputName+']');
        if (this.hidde.value.trim().length > 0) {
            this.tags = this.hidde.value.trim().split(this.config.separate);
        } else { this.tags=[]; }
        this.addTags();
        this.current = document.querySelectorAll('.'+this.config.inputName+' EM');

        this.input.addEventListener('keyup', e=>{
            if(e.keyCode === 32 && this.input.value.trim()!='') {
                let val = this.input.value.trim();
                if (this.checkDuble(val)) { 
                    if (this.validate(val)) {
                        this.tags.push(val);
                        this.addTags();
                        this.input.value='';
                        this.current = document.querySelectorAll('EM');
                        this.addInfo('');
                    } else {
                        this.input.value= '';
                        this.addInfo(this.alert + ': ' + val);
                    }
                } else {
                    this.input.value= '';    // czyszczenia zawrtosci inputa                            
                    this.addInfo(this.trans.errorDuble + ": " + val); // komunikat o zdublowaniu wartosci
                }
            }
        });
    }

    checkDuble(val) {
        let bool = true;
        this.tags.forEach(el=>{ if(el===val) { bool = false;}});
        return bool;
    }

    validate(val){
        if (this.config.limit>0) {
            let checkLenght = this.hidde.value.length + val.length + this.config.separate.length;
            this.alert=this.trans.errorLimit;
            if (checkLenght>this.config.limit) { return false;}
        }

        switch(this.config.type){
            case "text": return this.checktext(val); break;
            case "mail": return this.checkmail(val); break;
            default: return this.checkdefault(val); break;
        }
    }

    checkdefault(val) {
        let bool = false;
        this.alert=this.trans.errorDefu;
        const reg = new RegExp ("^[A-z0-9]", "ig");
        if (reg.test(val)) { bool = true;}
        return bool;
    }

    checkmail(val) {
        let bool = false;
        this.alert=this.trans.errorEmail;
        const reg = /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*@([a-zA-Z0-9_-]+)(\.[a-zA-Z0-9_-]+)*(\.[a-zA-Z]{2,4})$/i;
        if (reg.test(val.trim())) { bool = true;}
        return bool;
    }

    checktext(val) {
        let bool = false;
        this.alert=this.trans.errorText;
        const reg = new RegExp ("^[A-z]", "ig");
        const regnr = new RegExp ("[0-9]", "ig");
        if (reg.test(val)) { bool = true;}
        if (regnr.test(val)) { bool = false;}
        return bool;
    }

    createArea() { // ukrway wbrany input i generuje nowe elementy
        const hiddeTemp = document.querySelector('input[name='+this.config.inputName+']');

        const div = document.createElement('div');
        div.setAttribute('class', 'field '+this.config.inputName);

        const hiddInput = document.createElement('input');
        hiddInput.setAttribute('type', 'hidden');
        hiddInput.setAttribute('name', hiddeTemp.name);
        hiddInput.setAttribute('value', hiddeTemp.value);
        const divinfo = document.createElement('div');
        divinfo.setAttribute('class', 'info');
        divinfo.setAttribute('data-alert', this.config.inputName);
        const areaTab = document.createElement('div');
        areaTab.setAttribute('class', 'areaTags '+this.config.inputName);
        
        const inpempt = document.createElement('input');
        inpempt.setAttribute('placeholder', this.trans.placeholder); 
        inpempt.setAttribute('data-empty', this.config.inputName);                             
        areaTab.appendChild(inpempt);

        hiddeTemp.after(div);
        hiddeTemp.remove();
        div.appendChild(hiddInput);
        div.appendChild(areaTab);
        div.appendChild(divinfo);
    }

    createTag (label) {
        const ikona = "<svg class=svg1><rect x=1 y=1 width=100% height=100% /></svg><svg class=svg2><rect x=1 y=1 width=100% height=100% /></svg>";
        const div = document.createElement('div');
        div.setAttribute('class', 'tag '+this.config.inputName);
        const span = document.createElement('span');
        span.innerText = label;
        const close = document.createElement('em');
        close.setAttribute('data-items', label);
        close.innerHTML = ikona;

        div.appendChild(span);
        div.appendChild(close);
        return div;
    }

    reset() {
        document.querySelectorAll('.tag.'+this.config.inputName).forEach(function(tag){tag.parentElement.removeChild(tag);});
    }

    addTags() {
        this.reset();
        this.tags.slice().reverse().forEach(tag=>{
            const input = this.createTag(tag);
            this.areaTags.prepend(input);
        })
        this.hidde.value=this.tags.join(this.config.separate);
        let current = document.querySelectorAll('.'+this.config.inputName+' EM');
        current.forEach(el=>{
    
            el.addEventListener('click', e=>{
                const value = e.currentTarget.getAttribute('data-items');
                const index = this.tags.indexOf(value);
                this.tags = [ ...this.tags.slice(0, index), ...this.tags.slice(index+1)];
                this.addTags();
                this.current = document.querySelectorAll('.'+this.config.inputName + ' EM');
            });
            
        });
    }

    addInfo(info) {
        const div = document.querySelector('[data-alert='+this.config.inputName+']');
        if (info) {
            div.innerHTML = '<span class="tagAlert"><strong>'+this.trans.alertTitle+': </strong>'+info+'</span>';
        } else { 
            div.innerHTML = info;
        }
    }
}

