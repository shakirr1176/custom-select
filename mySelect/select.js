import CommonVar from "./commonVar.js"
import EventHandle from "./eventHandle.js"

class CustomSelect extends CommonVar{
    constructor(wrapper, option) {
        super()
        this.declaration(wrapper, option)
        this.initialize()
        this.draw()
    }

    initialize() {
        this.observer = () => {
            return new MutationObserver(entries => {
                entries.forEach(entry => {
                    let select = entry.target
                    if (select) {
                        let customSelect = select.closest(`.${this.wrapperClass}`)
                        if (entry.type == 'childList') {

                            if (!customSelect) return

                            let listUl = customSelect.querySelector(`.${this.dropDownDivClass}`)

                            listUl.innerHTML = ''

                            let lists = '';
                            if (select.children.length > 0) {
                                for (let i = 0; i < select.children.length; i++) {
                                    lists += `<li class="${this.optionClass}">${select.children[i].innerHTML}</li>`
                                }
                            }

                            listUl.innerHTML = lists

                            if (this.reset || this.search) {
                                listUl.children[0].classList.add('hidden')
                            }
                        }

                        if (entry.type == 'attributes') {
                            if (select.disabled) {
                                customSelect?.classList.add('disable')
                            } else {
                                customSelect?.classList.remove('disable')
                            }
                        }
                    }

                })
            })
        }
        this.wrapper.classList.add('my-select')
    }

    declaration(wrapper, option) {
        this.wrapper = wrapper
        this.noDataMsg = option.noDataMsg ? option.noDataMsg : 'no data'
        this.noDataClass = option.noDataClass ? option.noDataClass : 'no-data'
        this.options = option.options ? option.options : false
        this.searhIcon = option.searhIcon ? option.searhIcon : `<svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>`
        this.search = option.search ? option.search : false
        this.placeholder = option.placeholder ? option.placeholder : 'Search'
        this.defaultSelectedText = option.defaultSelectedText ? option.defaultSelectedText : 'Select'
        this.observe = option.observe ? option.observe : false
        this.onChange = option.onChange;
        this.reset = option.reset
        this.resetIcon = option.resetIcon ? option.resetIcon : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>`
        this.icon = option.icon ? option.icon : `<svg xmlns="htfirstLitp://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>`
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

    doSearch(obj) {
        let { select, value } = obj
        if (this.options) {
            let lists = this.options.filter(data => data.title.toLowerCase().startsWith(value.toLowerCase()))
            this.buildList(lists, select)
        } else {
            console.warn('options property missing')
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
                let firstLi = customSelect.querySelector(`.${this.optionClass}`)
                if (firstLi) {
                    this.selectOption(firstLi)
                    // need to work
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

            if(this.icon){
                customSelect.innerHTML += `<span class="arrow-down">${this.icon}</span>`
            }


            if (this.reset) {

                let resetDiv = document.createElement('button')
                resetDiv.className = 'reset-btn'
                resetDiv.innerHTML = this.resetIcon
                resetDiv.onclick = () => this.resetFunc(resetDiv)
                customSelect.append(resetDiv)

            }

            let selectedDiv = document.createElement('div')
            selectedDiv.className = this.selectClass
            customSelect.append(selectedDiv)

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
                    div.innerHTML = this.searhIcon
                    let inp = document.createElement('input')
                    inp.className = this.searchInputClass
                    inp.oninput = () => this.doSearch({ select, inp, value: inp.value })
                    inp.placeholder = this.placeholder
                    div.append(inp)
                    listWrapper.append(div)
                }

                listWrapper.append(listUl)
                customSelect.append(listWrapper)
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

let eventHandle = new EventHandle({
    onChange: (select)=>{
        console.log(select.value);
    }
})

export default CustomSelect;