import CommonVar from "./commonVar.js"
import EventHandle from "./eventHandle.js"

export class TurnIntoCustom extends CommonVar {
    constructor(wrapper, option) {
        super()
        this.declaration(wrapper, option)
        this.initialize()
        this.draw()
    }

    initialize() {
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

                        listUl.innerHTML = ''

                        let lists = '';

                        let isSelected = false

                        if (select.children.length > 0) {
                            for (let i = 0; i < select.children.length; i++) {
                                lists += `<li class="${this.optionClass} ${select.children[i].selected ? 'selected' : ''}">${select.children[i].innerHTML}</li>`
                            }
                        }

                        listUl.innerHTML = lists

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

        this.multiple = option && option.multiple ? option.multiple : false
        this.noDataMsg = option && option.noDataMsg ? option.noDataMsg : 'no data'
        this.noDataClass = option && option.noDataClass ? option.noDataClass : 'no-data'
        this.defaultSelectedText = option && option.defaultSelectedText ? option.defaultSelectedText : (this.madeOption(this.wrapper).defText ? this.madeOption(this.wrapper).defText : 'select')
        this.options = option && option.options ? option.options : this.madeOption(this.wrapper).convertedOption
        this.searchIcon = option && option.searchIcon ? option.searchIcon : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>`

        this.search = option && option.search ? option.search : false
        this.placeholder = option && option.placeholder ? option.placeholder : 'Search'
        this.observe = option && option.observe == false && this.search == false ? false : true
        this.onChange = option && option.onLoad;
        this.reset = option && option.reset ? option.reset : this.search ? this.search : false
        this.resetIcon = option && option.resetIcon ? option.resetIcon : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>`
        this.icon = option && option.icon ? option.icon : `<svg xmlns="htfirstLitp://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>`
    }

    draw() {

        if (this.options && this.options.length > 0) {
            let select = this.wrapper?.querySelector('select')
            if (select) {
                if (select.multiple) {
                    this.multiple = true
                }
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

    madeOption(wrapper) {

        if (!wrapper) return

        let select = wrapper.querySelector('select')

        let opts = [...select.children]

        let convertedOption;
        let defText;

        if (opts.length) {
            convertedOption = opts.map((opt, i) => {
                return {
                    'value': opt.value,
                    'title': opt.innerHTML,
                    'selected': opt.selected ? true : false,
                }
            })
        }

        if (opts[0] && (opts[0].getAttribute('value') == null || opts[0].getAttribute('value') == '')) {
            defText = convertedOption[0].title
            convertedOption = convertedOption.slice(1, convertedOption.length)
        }

        return {
            defText,
            convertedOption
        }
    }

    doSearch(obj) {
        if (this.observe) {
            let { customSelect, value } = obj
            if (this.options) {
                let lists = this.options.filter(data => data.title.toLowerCase().startsWith(value.toLowerCase()))
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

            if (customSelect && select && !select.disabled) {

                select.children[0].removeAttribute('value')

                let firstLi = customSelect.querySelector(`.${this.optionClass}`)

                if (firstLi) {

                    this.selectOption(firstLi)

                    let selectedDiv = customSelect.querySelectorAll(`.${this.optionClass}.selected`)
                    selectedDiv?.forEach(el => el.classList.remove('selected'))

                    if (customSelect.querySelector(`.${this.searchInputClass}`)) {
                        customSelect.querySelector(`.${this.searchInputClass}`).value = ''
                    }
                }
            }

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

        let allOption = `<li data-index="0" class="${this.optionClass} hidden">${this.defaultSelectedText}</li>`

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
                    el.index = i + 1
                })

                let select = customSelect?.querySelector('select')
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

            if (this.reset) {
                let resetDiv = document.createElement('button')
                resetDiv.className = 'reset-btn'
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

            let selectedDiv = document.createElement('div')
            selectedDiv.className = this.selectClass
            customSelect.prepend(selectedDiv)

            let listUl = document.createElement('ul')
            listUl.className = this.dropDownDivClass

            let select = customSelect?.querySelector('select')
            select?.classList.add('hidden')

            if (select && this.options && this.options.length > 0) {
                let hasSelected = false;
                let selectedLi = [];
                let selectedIndex = [];
                let lists = ''

                let isHidden = '';

                if(this.multiple){
                    isHidden = 'hidden'
                }

                lists = `<li data-index="0" class="${this.optionClass} ${isHidden}">${this.defaultSelectedText}</li>`

                for (let i = 0; i < this.options.length; i++) {

                    lists += `<li data-value="${this.options[i].value}" data-index="${this.options[i].index}" class="${this.optionClass}">${this.options[i].title}</li>`

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

                if (this.reset || this.search) {
                    listUl.children[0].classList.add('hidden')
                }

                if (!hasSelected) {
                    selectedLi = [listUl.children[0]]
                } else {
                    if (this.multiple) {
                        selectedLi = selectedIndex.map(el => listUl.children[el])
                    } else {
                        selectedLi = [listUl.children[selectedIndex[selectedIndex.length - 1]]]
                    }
                }

                let listWrapper = document.createElement('div')
                listWrapper.className = this.dropDownDivWrapperClass

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

                    if (selectedDiv.innerHTML == '') {
                        selectedDiv.innerHTML = listUl.children[0].innerHTML
                        let resetBtn = customSelect.querySelector('.reset-btn');
                        resetBtn?.classList.add('hidden')
                    }

                    selectedIndex.forEach(index => {
                        this.selectMultiple({ index, listUl, select })
                    })
                } else {
                    this.selectOption(selectedLi[selectedLi.length - 1])
                }
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