import CommonVar from "./commonVar.js"
import EventHandle from "./eventHandle.js"

class TurnIntoCustom extends CommonVar {
    constructor(wrapper, option) {
        super()
        this.declaration(wrapper, option)
        this.initialize()
        this.draw()
    }

    initialize() {

        if (this.wrapper == null || this.wrapper == undefined || this.wrapper.children == undefined) return

        this.observer = () => {
            return new MutationObserver(entries => {

                if (entries[0] && entries[0].type == 'attributes') {
                    let select = entries[0].target
                    if (select) {
                        let customSelect = select.closest(`.${this.wrapperClass}`)
                        if (select.disabled) {
                            customSelect?.classList.add('disable')
                        } else {
                            customSelect?.classList.remove('disable')
                        }
                    }
                }

                if (entries[0] && entries[0].type == 'childList') {

                    let select = entries[0].target

                    if (select) {
                        let customSelect = select.closest(`.${this.wrapperClass}`)

                        if (!customSelect) return

                        let listUl = customSelect.querySelector(`.${this.dropDownDivClass}`)

                        let lists = '';

                        if (select.children.length > 0) {
                            for (let i = 0; i < select.children.length; i++) {
                                lists += `<li class="${this.optionClass} ${select.children[i].selected ? 'selected' : ''}">${select.children[i].innerHTML}</li>`
                            }
                        }

                        listUl.innerHTML = lists
                    }
                }
            })
        }

        this.wrapper?.classList.add(this.wrapperClass)
    }

    declaration(wrapper, option) {
        this.wrapper = wrapper
        this.multiple = option && option.multiple ? option.multiple : false
        this.noDataMsg = option && option.no_Data_Msg ? option.no_Data_Msg : 'no data'
        this.noDataClass = option && option.noDataClass ? option.noDataClass : 'no-data'
        this.defaultSelectedText = option && option.default_selected_text ? option.default_selected_text : 'select'
        this.options = option && option.options ? [...option.options] : this.madeOption(this.wrapper)?.convertedOption
        this.searchIcon = option && option.search_icon ? option.search_icon : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>`

        this.showOption = option && option.show_option ? option.show_option : 5 
        this.search = option && option.search ? option.search : false
        this.searchType = option && option.search_type ? option.search_type : 'startWith'
        this.placeholder = option && option.placeholder ? option.placeholder : 'Search'
        this.observe = option && option.observe == false && this.search == false ? false : true
        this.onChange = option && option.onLoad;
        this.reset = option && option.reset ? option.reset : this.search ? this.search : false
        this.resetIcon = option && option.reset_icon ? option.reset_icon : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>`
        this.icon = option && option.drop_down_icon ? option.drop_down_icon : `<svg xmlns="htfirstLitp://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>`
    }

    draw() {

        this.hasRapper(this.wrapper)

            let select = this.wrapper?.querySelector('select')

            if(!select) return

            if (select.multiple) {
                this.multiple = true
            }else if(this.multiple){
                select.multiple = true
            }

        if (this.wrapper) {
            this.convertToDiv(this.wrapper)
        }
    }

    hasRapper(wrapper){
        if (wrapper == null || wrapper == undefined || wrapper.children == undefined) return
    }

    madeOption(wrapper) {

        this.hasRapper(wrapper)

        let select = wrapper?.querySelector('select')

        if (!select) return

        let opts = [...select.children]

        let convertedOption;

        if (opts.length) {
            convertedOption = opts.map((opt, i) => {
                return {
                    'value': opt.getAttribute('value') == null ? '' : opt.value,
                    'title': opt.innerHTML,
                    'selected': opt.getAttribute('selected') != null ? true : false,
                }
            })
        }

        return {
            convertedOption
        }
    }

    doSearch(obj) {
        if (this.observe) {
            let { customSelect, value } = obj
            if (this.options) {

                let lists;

                if(this.searchType == 'similar'){
                    lists = this.options.filter(data => data.title.toLowerCase().includes(value.toLowerCase()))
                }else if(this.searchType == 'exact'){
                    lists = this.options.filter(data =>data.title.toLowerCase() === value.toLowerCase())
                }else{
                    lists = this.options.filter(data =>data.title.toLowerCase().startsWith(value.toLowerCase()))
                }

                this.buildList(lists, customSelect)
                this.handleListPost(customSelect)
            } else {
                console.warn('options property missing')
            }
        }
    }

    resetFunc(resetBtn) {
        if (resetBtn) {
            let customSelect = resetBtn.closest(`.${this.wrapperClass}`)
            let select = customSelect?.querySelector('select')

            if (this.options) {
                this.buildList(this.options, customSelect)
            }

            select.value = ''

            if (customSelect && select && !select.disabled) {
                let selectedDiv = customSelect.querySelector('.selected-div')

                selectedDiv.innerHTML = this.defaultSelectedText

                let selectedLi = customSelect.querySelectorAll(`.${this.optionClass}.selected`)
                selectedLi?.forEach(el => el.classList.remove('selected'))

                if (customSelect.querySelector(`.${this.searchInputClass}`)) {
                    customSelect.querySelector(`.${this.searchInputClass}`).value = ''
                }
            }

            resetBtn?.classList.add('hidden');

            this.handleListPost(customSelect)
        }
    }

    buildList(lists, cus) {
        if (!cus) return

        cus.classList.add('searching')

        let listUlWrapper = cus.querySelector(`.${this.dropDownDivWrapperClass}`)
        let listUl = cus.querySelector(`.${this.dropDownDivClass}`)
        let select = cus.querySelector('select')

        if (!listUl) return

        let allOption = ``

        lists.forEach((opt) => {
            allOption += `<li data-value="${opt.value}" data-index="${opt.index}" class="${this.optionClass}">${opt.title}</li>`
        })

        listUl.innerHTML = allOption

        for (let i = 0; i < select.selectedOptions.length; i++) {
            let filterList = cus.querySelector(`.${this.dropDownDivWrapperClass}`)?.querySelector(`.${this.optionClass}[data-index='${select.selectedOptions[i].index}']`)
            if (filterList) {
                filterList.classList.add('selected')
            }
        }

        let noDataDiv = listUlWrapper?.querySelector(`.${this.noDataClass}`)

        if (lists.length == 0) {
            if (!noDataDiv) {
                let noDataShow = document.createElement('div')
                noDataShow.innerHTML = this.noDataMsg
                noDataShow.className = this.noDataClass

                if (listUlWrapper && listUl) {
                    listUlWrapper.appendChild(noDataShow)
                    listUl.style.all = 'initial'
                }
            }
        } else {
            if (noDataDiv && listUl) {
                noDataDiv.remove()
                listUl.style.all = null
            }
        }
    }

    convertToDiv(customSelect) {
        if (!customSelect.querySelector(`.${this.dropDownDivClass}`)) {
            if (this.options && this.options.length > 0) {

                this.options.forEach((el, i) => {
                    el.index = i
                })

                let select = customSelect?.querySelector('select')

                if (select) {

                    if(select.children.length == 0){
                        let allOption = ''
                        this.options.forEach(opt => {
                            let singleOpt = `<option value="${opt.value}">${opt.title}</option>`
                            allOption += singleOpt
                        })
    
                        select.innerHTML = allOption
                    }

                    select.value = ''

                    if (this.reset) {
                        let resetDiv = document.createElement('button')
                        resetDiv.className = 'reset-btn hidden'
                        resetDiv.innerHTML = this.resetIcon
                        resetDiv.onclick = () => this.resetFunc(resetDiv)
                        customSelect.appendChild(resetDiv)
                    }
        
                    if (this.icon) {
                        let downDiv = document.createElement('span')
                        downDiv.className = 'arrow-down'
                        downDiv.innerHTML = this.icon
                        customSelect.appendChild(downDiv)
                    }

                    select.classList.add('hidden')

                    let selectedDiv = document.createElement('div')
                    selectedDiv.className = this.selectClass
                    selectedDiv.dataset['showOption'] = this.showOption

                    customSelect.dataset['default_selected_text'] = this.defaultSelectedText
                    selectedDiv.innerHTML = this.defaultSelectedText
        
                    customSelect.prepend(selectedDiv)
        
                    let listUl = document.createElement('ul')
                    listUl.className = this.dropDownDivClass
        
                    if (this.options && this.options.length > 0) {
                        let hasSelected = false;
                        let selectedLi = [];
                        let selectedIndex = [];
                        let lists = ''
                        
                        for (let i = 0; i < this.options.length; i++) {
                            
                            lists += `<li data-value="${this.options[i].value}" data-index="${this.options[i].index}" class="${this.optionClass} ${this.options[i].isHidden ? 'hidden' : ''}">${this.options[i].title}</li>`
                            
                            if (this.options[i].selected) {
                                hasSelected = true
                                if (this.multiple) {
                                    selectedIndex.push(this.options[i].index)
                                } else {
                                    selectedIndex = [this.options[i].index]
                                }
                            }
                        }
        
                        listUl.innerHTML = lists
        
                        if (hasSelected) {
                            if (this.multiple) {
                                selectedLi = selectedIndex.map(el => listUl.children[el])
                            } else {
                                selectedLi = [listUl.children[selectedIndex[selectedIndex.length - 1]]]
                            }
                        }
        
                        let listWrapper = document.createElement('div')
                        listWrapper.className = this.dropDownDivWrapperClass
                        listWrapper.classList.add('hidden')

                        if (this.search) {
                            let div = document.createElement('div')
                            div.className = this.searchInputClass + '-div'
                            div.innerHTML = `<span class="search-icon">${this.searchIcon}</span>`
                            let inp = document.createElement('input')
                            inp.className = this.searchInputClass
                            inp.oninput = () => this.doSearch({ customSelect, inp, value: inp.value })
                            inp.placeholder = this.placeholder
                            div.appendChild(inp)
                            listWrapper.appendChild(div)
                        }
        
                        listWrapper.appendChild(listUl)
                        customSelect.prepend(listWrapper)
        
                        if (this.multiple) {
                            listWrapper.classList.add('hidden')
                            selectedIndex.forEach(index => {
                                this.selectMultiple({ index, listUl, select })
                            })
                        } else {
                            if(selectedLi.length){
                                this.selectOption(selectedLi[selectedLi.length - 1])
                            }
                        }
                    }

                    if (select.disabled) {
                        customSelect.classList.add('disable')
                    }
    
                    this.observer().disconnect()
    
                    if (this.observe) {
                        this.observer().observe(select, { childList: true, attributes: true })
                    }
                }
            } 
        }
    }
}

let customSelect = new EventHandle({})

export function onChangeFun(callBack){
    return customSelect.onChange = (select)=>{callBack(select)}
}

export function turnIntoCustom(el,option){
    if(el){
        if(el.length){
            el.forEach(x=> {
                return new TurnIntoCustom(x,option)
            })
        }else{
            return new TurnIntoCustom(el,option)
        }
    }
}