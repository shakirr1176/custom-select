import CommonVar from "./commonVar.js"
import EventHandle from "./eventHandle.js"

export class TurnIntoCustom extends CommonVar{
    constructor(wrapper, option) {
        super()
        this.declaration(wrapper, option)
        this.initialize()
        this.draw()
    }

    initialize() {
        this.observer = () => {
            return new MutationObserver(entries => {

                if(entries[0] && entries[0].type == 'attributes'){
                    let select = entries[0].target
                    if(select){
                        let customSelect = select.closest(`.${this.wrapperClass}`)
                        if (select.disabled) {
                            customSelect?.classList.add('disable')
                        } else {
                            customSelect?.classList.remove('disable')
                        }
                    }
                }

                if(entries[1] && entries[1].type == 'childList'){
                    let select = entries[1].target
                    if (select) {
                        let customSelect = select.closest(`.${this.wrapperClass}`)

                        if (!customSelect) return

                        let listUl = customSelect.querySelector(`.${this.dropDownDivClass}`)

                        listUl.innerHTML = ''

                        let lists = '';

                        let isSelected = false

                        if (select.children.length > 0) {
                            for (let i = 0; i < select.children.length; i++) {
                                if(i > 0 && select.value == select.children[i].value){
                                    isSelected = true
                                    select.children[i].selected = true
                                }else{
                                    isSelected = false
                                }

                                lists += `<li class="${this.optionClass} ${isSelected ? 'selected' : ''}">${select.children[i].innerHTML}</li>`
                            }
                        }

                        listUl.innerHTML = lists

                        let wrapperDiv = listUl.closest(`.${this.wrapperClass}`)
                        this.handleListPost(wrapperDiv)

                        if (this.reset || this.search) {
                            listUl.children[0].classList.add('hidden')
                        }
                    }
                }
            })
        }
        this.wrapper.classList.add(this.wrapperClass)
    }

    declaration(wrapper, option) {
        this.wrapper = wrapper

        this.noDataMsg = option && option.noDataMsg ? option.noDataMsg : 'no data'
        this.noDataClass = option && option.noDataClass ? option.noDataClass : 'no-data'
        this.defaultSelectedText = option && option.defaultSelectedText ? option.defaultSelectedText : (this.madeOption(this.wrapper).defText ? this.madeOption(this.wrapper).defText : 'select')
        this.options = option && option.options ? option.options : this.madeOption(this.wrapper).convertedOption
        this.searhIcon = option && option.searhIcon ? option.searhIcon : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>`
        this.search = option && option.search ? option.search : false
        this.placeholder = option && option.placeholder ? option.placeholder : 'Search'
        this.observe = option && option.observe == false && this.search == false ? false : true
        this.onChange = option && option.onLoad;
        this.reset = option && option.reset
        this.resetIcon = option && option.resetIcon ? option.resetIcon : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>`
        this.icon = option && option.icon ? option.icon : `<svg xmlns="htfirstLitp://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>`
    }

    draw() {
        if (this.options && this.options.length > 0) {
            let select = this.wrapper?.querySelector('select')
            if (select) {
                select.innerHTML = `<option>${this.defaultSelectedText}</option>`
                let allOption = select.innerHTML
                this.options.forEach(opt => {
                    let singleOpt = `<option value="${opt.value}">${opt.title}</option>`
                    allOption += singleOpt
                })

                select.innerHTML = allOption
            }
        }

        if (this.wrapper) {
            this.convertToDiv(this.wrapper)
        }
    }

    madeOption(wrapper){

        if(!wrapper) return

        let select = wrapper.querySelector('select')
        
        let opts = [...select.children]

        let convertedOption;
        let defText;

        if(opts.length){
            convertedOption = opts.map(opt=> {
                return {
                    'value' : opt.value,
                    'title' : opt.innerHTML,
                    'selected' : opt.selected ? true : false
                }
            })
        }

        if(opts[0] && (opts[0].getAttribute('value') == null || opts[0].getAttribute('value') == '')){
            defText = convertedOption[0].title
            convertedOption = convertedOption.slice(1,convertedOption.length)
        }

        return {
            defText,
            convertedOption
        }
    }

    doSearch(obj) {
        if(this.observe){
            let { select, value } = obj
            if (this.options) {
                let lists = this.options.filter(data => data.title.toLowerCase().startsWith(value.toLowerCase()))
                this.buildList(lists, select)
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
                this.buildList(this.options, select)
            }

            if (customSelect && select && !select.disabled) {

                select.children[0].value = ''
                select.dataset['oldvalue'] = ''

                let firstLi = customSelect.querySelector(`.${this.optionClass}`)

                if (firstLi) {

                    this.selectOption(firstLi)

                    if (customSelect.querySelector(`.${this.searchInputClass}`)) {
                        customSelect.querySelector(`.${this.searchInputClass}`).value = ''
                    }
                }
            }
        }
    }

    buildList(lists, select) {
        let cus = select?.closest(`.${this.wrapperClass}`)
        cus?.classList.add('searching')

        if (!select) return

        select.innerHTML = `<option>${this.defaultSelectedText}</option>`
        let allOption = select.innerHTML
        lists.forEach(opt => {
            let singleOpt = `<option value="${opt.value}">${opt.title}</option>`
            allOption += singleOpt
        })

        select.innerHTML = allOption

        select.children[0].value = select.dataset['oldvalue']

        let listUlWrapper = cus?.querySelector(`.${this.dropDownDivWrapperClass}`)
        let listUl = cus?.querySelector(`.${this.dropDownDivClass}`)

        let noDataDiv = listUlWrapper?.querySelector(`.${this.noDataClass}`)

        if (lists.length == 0) {
            if (!noDataDiv) {
                let noDataShow = document.createElement('div')
                noDataShow.innerHTML = this.noDataMsg
                noDataShow.className = this.noDataClass

                if (listUlWrapper && listUl) {
                    listUlWrapper.append(noDataShow)
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
                let select = customSelect?.querySelector('select')
                if (select) {
                    select.innerHTML = `<option>${this.defaultSelectedText}</option>`
                    let allOption = select.innerHTML

                    this.options.forEach(opt => {
                        let singleOpt = `<option ${opt.selected ? 'selected' : ''} value="${opt.value}">${opt.title}</option>`
                        allOption += singleOpt
                    })

                    select.innerHTML = allOption
                }
            }

            if (this.reset) {
                let resetDiv = document.createElement('button')
                resetDiv.className = 'reset-btn'
                resetDiv.innerHTML = this.resetIcon
                resetDiv.onclick = () => this.resetFunc(resetDiv)
                customSelect.append(resetDiv)

            }

            if(this.icon){
                let downDiv = document.createElement('span')
                downDiv.className = 'arrow-down'
                downDiv.innerHTML = this.icon
                customSelect.append(downDiv)
            }

            let selectedDiv = document.createElement('div')
            selectedDiv.className = this.selectClass
            customSelect.prepend(selectedDiv)

            let listUl = document.createElement('ul')
            listUl.className = this.dropDownDivClass

            let select = customSelect?.querySelector('select')
            select?.classList.add('hidden')

            if (select && select.children.length > 0) {
                let hasSelected = false;
                let selectedLi = [];
                let selectedIndex;

                let lists = ''
                for (let i = 0; i < select.children.length; i++) {
                    lists += `<li class="${this.optionClass}">${select.children[i].innerHTML}</li>`

                    if (i > 0) {
                        if (select.children[i].selected) {
                            hasSelected = true
                            selectedIndex = i
                        }
                    }
                }

                listUl.innerHTML = lists

                if (!hasSelected) {
                    selectedLi = [listUl.children[0]]
                } else {
                    selectedLi.push(listUl.children[selectedIndex])
                }

                let listWrapper = document.createElement('div')
                listWrapper.className = this.dropDownDivWrapperClass

                if (this.search) {
                    let div = document.createElement('div')
                    div.className = this.searchInputClass + '-div'
                    div.innerHTML = `<span class="search-icon">${this.searhIcon}</span>`
                    let inp = document.createElement('input')
                    inp.className = this.searchInputClass
                    inp.oninput = () => this.doSearch({ select, inp, value: inp.value })
                    inp.placeholder = this.placeholder
                    div.append(inp)
                    listWrapper.append(div)
                }

                listWrapper.append(listUl)
                customSelect.prepend(listWrapper)
                this.selectOption(selectedLi[0])

            }

            if (select) {
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

export let customSelect = new EventHandle({})