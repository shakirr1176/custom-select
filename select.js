class CustomSelect {
    constructor(option) {
        this.onChange = option.onChange; 
        this.reset = option.reset
        this.resetIcon = option.resetIcon ? option.resetIcon : `<svg class="reset-btn" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>`
        this.icon = option.icon ? option.icon : `<svg class="arrow-down" xmlns="htfirstLitp://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>`
        this.prevCustom = undefined
        this.wrapperClass = option.wrapperClass ? option.wrapperClass : 'custom-select'
        this.selectClass = option.selectClass ? option.selectClass : 'selected-div',
        this.dropDownDivClass = option.dropDownDivClass ? option.dropDownDivClass : 'list-ul',
        this.optionClass = option.optionClass ? option.optionClass : 'custom-list',
        this.draw()
    }

    draw() {
        window.addEventListener('load', () => {
            let observe = new MutationObserver(entries=>{
                entries.forEach(entry=>{
                    let customSelect = entry.target.closest(`.${this.wrapperClass}`)
                    if(entry.target.disabled){
                        customSelect.classList.add('disable')
                    }else{
                        customSelect.classList.remove('disable')
                    }
                })
            });

            let AllCustomSelect = document.querySelectorAll(`.${this.wrapperClass}`)
            AllCustomSelect?.forEach(el => {
                this.convertToDiv(el)
                let select = el?.querySelector('select')
                if(select){
                    if(select.disabled){
                        el.classList.add('disable')
                    }
                    observe.observe(select, {attributes:true})
                }
            })
        })

        document.addEventListener('mouseover',(e)=>{
            if (e.target.closest(`.${this.optionClass}`)) {
                let li = e.target.closest(`.${this.optionClass}`)
                let listUl = li.closest(`.${this.dropDownDivClass}`)
                let list = listUl.closest(`.${this.dropDownDivClass}`).querySelectorAll(`.${this.optionClass}`)
                if(li){
                    this.deselectAllOptions(list)
                    li.classList.add('selected')
                }
            }
        })

        document.addEventListener('click', (e) => {
            if (e.target.closest('.reset-btn')) {
                let customSelect = e.target.closest(`.${this.wrapperClass}`)
                let select = customSelect?.querySelector('select')
                if (customSelect && select && !select.disabled) {
                    let firstLi = customSelect.querySelector(`.${this.optionClass}`)
                    if (firstLi) {
                        this.selectOption(firstLi)
                    }
                }
            }

            if (e.target.closest(`.${this.optionClass}`)) {
                let li = e.target.closest(`.${this.optionClass}`)
                if(li){
                    this.selectOption(li)
                }
            }

            if (e.target.closest(`.${this.selectClass}`)) {
                let currentList = e.target.closest(`.${this.wrapperClass}`)
                if (this.prevCustom) {
                    let prevCustomSelectItem = this.prevCustom.querySelector(`.${this.dropDownDivClass}`)
                    prevCustomSelectItem?.classList.add('hidden')
                }

                if (currentList && currentList.querySelector('select') && !currentList.querySelector('select').disabled && this.prevCustom != currentList) {
                    let currentListItem = currentList.querySelector(`.${this.dropDownDivClass}`)
                    currentListItem?.classList.remove('hidden')
                    this.prevCustom = currentList

                    let select = currentList.querySelector('select')
                    if(select && select.children.length > 0){

                        let list = currentList.querySelector(`.${this.dropDownDivClass}`)?.querySelectorAll(`.${this.optionClass}`)
                        
                        if(list && list[select.selectedIndex]){
                            this.deselectAllOptions(list)
                            list[select.selectedIndex].classList.add('selected')
                            list[select.selectedIndex].scrollIntoView({ block: 'center' })
                        }else{
                            if(list.length){
                                this.deselectAllOptions(list)
                                list[0].scrollIntoView({ block: 'center' })
                            }
                        }
                    }

                } else {
                    this.prevCustom = undefined
                }
            } else {
                if ((this.prevCustom && !e.target.closest(`.${this.dropDownDivClass}`)) || e.target.closest(`.${this.optionClass}`)) {
                    let prevCustomSelectItem = this.prevCustom?.querySelector(`.${this.dropDownDivClass}`)
                    prevCustomSelectItem?.classList.add('hidden')
                    this.prevCustom = undefined
                }
            }
        })

        window.addEventListener('keydown', (e) => {
            if (this.prevCustom) {
                let crrLi = this.prevCustom.querySelector(`.${this.dropDownDivClass} .selected`)
                let listUl = this.prevCustom.querySelector(`.${this.dropDownDivClass}`)

                this.listSelectByKeyPress({ crrLi, listUl, e })
            }
        })
        
    }

    listSelectByKeyPress(obj) {

        let { crrLi, listUl, e } = obj

        if (e.key == 'ArrowDown') {

            let firstLi = listUl?.children[0]

            let nextSibl;

            if (crrLi && crrLi.nextElementSibling) {
                nextSibl = crrLi.nextElementSibling
            } else {
                nextSibl = firstLi
            }

            crrLi?.classList.remove('selected')
            nextSibl?.classList.add('selected')

            nextSibl.scrollIntoView({ behavior: 'smooth' })
        }
        if (e.key == 'ArrowUp') {
            let prevSibl;
            let lastLi = listUl?.children[listUl?.children.length - 1]


            if (crrLi && crrLi.previousElementSibling) {
                prevSibl = crrLi.previousElementSibling
            } else {
                prevSibl = lastLi
            }

            crrLi?.classList.remove('selected')
            prevSibl?.classList.add('selected')

            prevSibl.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }

        if(e.key == 'Enter'){
            this.selectOption(crrLi)
        }
    }

    convertToDiv(customSelect) {
        if (!customSelect.querySelector(`.${this.dropDownDivClass}`)) {

            customSelect.innerHTML += this.icon
            if (this.reset) {
                customSelect.innerHTML += this.resetIcon
            }

            let selectedDiv = document.createElement('div')
            selectedDiv.className = this.selectClass
            customSelect.append(selectedDiv)

            let listUl = document.createElement('ul')
            listUl.className = this.dropDownDivClass

            let select = customSelect.querySelector('select')
            select?.classList.add('hidden')

            if (select && select.children.length > 0) {

                let hasSelected = false;
                let selectedLi = [];

                for (let i = 0; i < select.children.length; i++) {
                    let li = document.createElement('li')
                    li.className = this.optionClass
                    li.innerHTML = select.children[i].innerHTML
                    listUl.append(li)

                    if (i > 0) {
                        if (select.children[i].selected) {
                            hasSelected = true
                            selectedLi.push(li)
                        }
                    }
                }

                if (!hasSelected) {
                    selectedLi = [listUl.children[0]]
                }

                customSelect.append(listUl)

                this.selectOption(selectedLi[0])
            }
        }
    }

    selectOption(li) {
        let customSelect = li.closest(`.${this.wrapperClass}`);
        if (customSelect) {
            let listUl = li.closest(`.${this.dropDownDivClass}`);
            let list = listUl.closest(`.${this.dropDownDivClass}`).querySelectorAll(`.${this.optionClass}`);
            let options = customSelect.querySelector('select')?.querySelectorAll('option');
            let resetBtn = customSelect.querySelector('.reset-btn');

            this.deselectAllOptions(list);

            let indexOfli = [...list].indexOf(li);
            options[indexOfli].selected = true;
            li?.classList.add('selected');
            resetBtn?.classList.remove('hidden');

            if (indexOfli == 0 && (options[0] && (options[0].getAttribute('value') == null || options[0].getAttribute('value') == ''))) {
                li?.classList.remove('selected');
                resetBtn?.classList.add('hidden');
                let select = customSelect.querySelector('select');
                
                if (select) {
                    select.value = '';
                }
            }

            let selectedDiv = customSelect.querySelector(`.${this.selectClass}`);
            selectedDiv.innerHTML = li.innerHTML;
            listUl.classList.add('hidden');

            let select = customSelect.querySelector('select');

            if (typeof this.onChange === 'function') {
                this.onChange(select);
            }

            this.prevCustom = undefined;
        }
    }

    deselectAllOptions(list) {
        list?.forEach(option => option.classList.remove('selected'));
    }
}